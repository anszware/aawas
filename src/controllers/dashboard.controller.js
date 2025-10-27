'use strict';
const { User, Location, Device, DataDevice, LocationMember } = require('../models');
const { Op } = require('sequelize');

const getUserDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all locations the user is a member of
    const userLocations = await LocationMember.findAll({
      where: { userId },
      include: [
        {
          model: Location,
          attributes: ['id', 'name', 'address', 'lang', 'long'],
          include: [
            {
              model: Device,
              attributes: ['id', 'nomor_seri', 'ip', 'mac_address', 'lang', 'long', 'isActive', 'last_seen'],
              include: [
                {
                  model: DataDevice,
                  attributes: ['id', 'jenis_data', 'data', 'recorded_at'],
                  limit: 1, // Get only the latest data for each type
                  order: [['recorded_at', 'DESC']],
                }
              ]
            }
          ]
        }
      ]
    });

    // Format the response
    const dashboardData = userLocations.map(member => {
      const location = member.Location;
      if (!location) return null; // Should not happen if FKs are set up correctly

      const devices = location.Devices.map(device => {
        // Group data devices by jenis_data
        const latestData = {};
        if (device.DataDevices && device.DataDevices.length > 0) {
          device.DataDevices.forEach(dataPoint => {
            latestData[dataPoint.jenis_data] = { value: dataPoint.data, recorded_at: dataPoint.recorded_at };
          });
        }
        return {
          id: device.id,
          nomor_seri: device.nomor_seri,
          ip: device.ip,
          mac_address: device.mac_address,
          lang: device.lang,
          long: device.long,
          isActive: device.isActive,
          last_seen: device.last_seen,
          latest_data: latestData,
        };
      });

      return {
        location_id: location.id,
        location_name: location.name,
        location_address: location.address,
        location_lang: location.lang,
        location_long: location.long,
        user_role_in_location: member.role_member,
        devices: devices,
      };
    }).filter(Boolean); // Remove any null entries if location was not found

    res.status(200).json(dashboardData);

  } catch (error) {
    res.status(500).json({ message: 'Error fetching user dashboard data', error: error.message });
  }
};

const haversineDistance = (coords1, coords2) => {
  const toRad = (x) => x * Math.PI / 180;
  const R = 6371; // Earth radius in km

  const dLat = toRad(coords2.lat - coords1.lat);
  const dLon = toRad(coords2.lon - coords1.lon);
  const lat1 = toRad(coords1.lat);
  const lat2 = toRad(coords2.lat);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const getSuperAdminDashboard = async (req, res) => {
  try {
    const totalActiveProducts = await Device.count({ where: { isActive: true } });
    const totalLocations = await Location.count();
    const activeProductLocations = await Device.findAll({
      where: { isActive: true },
      include: [{
        model: Location,
        attributes: ['name', 'lang', 'long'],
        required: true
      }],
      attributes: ['id', 'nomor_seri']
    });

    res.status(200).json({
      totalActiveProducts,
      totalLocations,
      activeProductLocations: activeProductLocations.map(d => ({
        deviceId: d.id,
        deviceName: d.nomor_seri,
        lat: d.Location.lang,
        lng: d.Location.long,
        locationName: d.Location.name
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Super Admin dashboard data', error: error.message });
  }
};

const getAdminUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const userLocations = await LocationMember.findAll({
      where: { userId, role_member: 'admin' },
      attributes: ['locationId']
    });

    if (userLocations.length === 0) {
      return res.status(200).json({ hasLocation: false });
    }
    const locationData = await Location.findOne({
      where: { id: { [Op.in]: userLocations.map(ul => ul.locationId) } },
      attributes: ['lang', 'long']
    });

    const locationIds = userLocations.map(ul => ul.locationId);
    const totalActiveProducts = await Device.count({ where: { locationId: { [Op.in]: locationIds }, isActive: true } });
    const totalInactiveProducts = await Device.count({ where: { locationId: { [Op.in]: locationIds }, isActive: false } });

    const devices = await Device.findAll({
      where: { locationId: { [Op.in]: locationIds } },
      include: [
        { model: Location, attributes: ['name'] },
        { 
          model: DataDevice, 
          attributes: ['jenis_data', 'data', 'recorded_at'], 
          required: false,
          where: {
            jenis_data: {
              [Op.in]: ['PM10', 'PM2.5', 'CO', 'NOx', 'SO2', 'O3', 'HC']
            }
          }
        }
      ]
    });

    let totalSuhu = 0, countSuhu = 0;
    let totalKelembaban = 0, countKelembaban = 0;
    const qualityChartData = [];

    devices.forEach(device => {
      if(device.isActive) {
        device.DataDevices.forEach(data => {
          qualityChartData.push({
            jenis_data: data.jenis_data,
            data: data.data,
            recorded_at: data.recorded_at
          });

          if (data.jenis_data === 'suhu') {
            totalSuhu += data.data;
            countSuhu++;
          } else if (data.jenis_data === 'kelembaban') {
            totalKelembaban += data.data;
            countKelembaban++;
          }
        });
      }
    });

    res.status(200).json({
      hasLocation: true,
      locationLang: locationData.lang,
      locationLong: locationData.long,
      totalActiveProducts,
      totalInactiveProducts,
      productLocations: devices.map(d => ({ deviceName: d.nomor_seri, lat: d.lang, lng: d.long, locationName: d.Location.name })),
      averageTemp: countSuhu > 0 ? totalSuhu / countSuhu : 0,
      averageHumidity: countKelembaban > 0 ? totalKelembaban / countKelembaban : 0,
      qualityChartData: qualityChartData,
    });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching Admin User dashboard data', error: error.message });
  }
};

const getUserRoleDashboard = async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ message: 'Latitude and Longitude are required' });
  }

  try {
    const userCoords = { lat: parseFloat(lat), lon: parseFloat(lon) };

    const activeDevices = await Device.findAll({
      where: { isActive: true },
      include: [{ model: Location, attributes: ['lang', 'long'], required: true }]
    });

    if (activeDevices.length === 0) {
      return res.status(404).json({ message: 'No active devices found' });
    }

    let nearestDevice = null;
    let minDistance = Infinity;

    activeDevices.forEach(device => {
      const deviceCoords = { lat: parseFloat(device.Location.lang), lon: parseFloat(device.Location.long) };
      const distance = haversineDistance(userCoords, deviceCoords);
      if (distance < minDistance) {
        minDistance = distance;
        nearestDevice = device;
      }
    });

    const deviceData = await DataDevice.findAll({
      where: { deviceId: nearestDevice.id }
    });

    let totalSuhu = 0, countSuhu = 0;
    let totalKelembaban = 0, countKelembaban = 0;
    const carbonData = [];

    deviceData.forEach(data => {
        if (data.jenis_data === 'suhu') {
            totalSuhu += data.data;
            countSuhu++;
        } else if (data.jenis_data === 'kelembaban') {
            totalKelembaban += data.data;
            countKelembaban++;
        } else if (data.jenis_data === 'karbon') {
            carbonData.push(data.data);
        }
    });
    
    const notifications = await Notification.findAll({
        where: { locationId: nearestDevice.locationId },
        order: [['createdAt', 'DESC']],
        limit: 10
    });

    res.status(200).json({
      nearestDevice: {
        deviceName: nearestDevice.nomor_seri,
        distanceKm: minDistance,
        averageTemp: countSuhu > 0 ? totalSuhu / countSuhu : 0,
        averageHumidity: countKelembaban > 0 ? totalKelembaban / countKelembaban : 0,
        carbonChartData: carbonData,
      },
      notifications
    });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching User dashboard data', error: error.message });
  }
};


module.exports = {
  getUserDashboardData,
  getSuperAdminDashboard,
  getAdminUserDashboard,
  getUserRoleDashboard,
};
