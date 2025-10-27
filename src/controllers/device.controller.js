'use strict';
const { Device, Location } = require('../models');
const { createLocationNotification } = require('../services/notification.service');

const createDevice = async (req, res) => {
  try {
    const { locationId, ...deviceData } = req.body;

    if (locationId) {
      const location = await Location.findByPk(locationId);
      if (!location) {
        return res.status(404).json({ message: 'Location not found' });
      }
    }

    const newDevice = await Device.create({ ...deviceData, locationId });
    res.status(201).json({ message: 'Device created successfully', device: newDevice });
  } catch (error) {
    res.status(500).json({ message: 'Error creating device', error: error.message });
  }
};

const getAllDevices = async (req, res) => {
  try {
    const devices = await Device.findAll({
      include: [{ model: Location, attributes: ['id', 'name'] }]
    });
    res.status(200).json(devices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching devices', error: error.message });
  }
};

const getAllDevicesLocations = async (req, res) => {
  try {
    const devices = await Device.findAll({
      include: [{ model: Location, attributes: ['id', 'name'] }],
       where: {
        locationId: req.params.id
      }
    });
    res.status(200).json(devices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching devices', error: error.message });
  }
};

const getDeviceById = async (req, res) => {
  try {
    const device = await Device.findByPk(req.params.id, {
      include: [{ model: Location, attributes: ['id', 'name'] }]
    });
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    res.status(200).json(device);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching device', error: error.message });
  }
};

const updateDevice = async (req, res) => {
  try {
    const { locationId, ...deviceData } = req.body;
    const device = await Device.findByPk(req.params.id);
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    if (locationId) {
      const location = await Location.findByPk(locationId);
      if (!location) {
        return res.status(404).json({ message: 'Location not found' });
      }
    }

    await device.update({ ...deviceData, locationId });
    res.status(200).json({ message: 'Device updated successfully', device });
  } catch (error) {
    res.status(500).json({ message: 'Error updating device', error: error.message });
  }
};

const activeDevice = async (req, res) => {
  try {
    const { noseri } = req.params;
    const deviceData = req.body;

    const device = await Device.findOne({ where: { nomor_seri: noseri } });
    console.log(device);
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }    
    // add locationId from the found device into deviceData
    deviceData.locationId = device.locationId;

    // if (device.locationId) {
    //   const location = await Location.findByPk(device.locationId);
    //   if (!location) {
    //     return res.status(404).json({ message: 'Location not found' });
    //   }
    // }

    await device.update(deviceData);

    if (device.locationId) {
      const io = req.app.get('socketio');
      await createLocationNotification(io, device.locationId, `Device ${device.nomor_seri} has been activated.`, 'device_activated');
    }

    res.status(200).json({ message: 'Device updated successfully', device });
  } catch (error) {
    res.status(500).json({ message: 'Error updating device', error: error.message });
  }
};
const statusDevice = async (req, res) => {
  try {
    const { noseri } = req.params;

    const device = await Device.findOne({ where: { nomor_seri: noseri } });
     if (!device.isActive) {
      res.status(404).json({ message: 'Device is Not Active', active : false });
    }

    res.status(200).json({ message: 'Device is active', active : true });

  } catch (error) {
    res.status(500).json({ message: 'Error updating device', error: error.message });
  }
};

const deleteDevice = async (req, res) => {
  try {
    const device = await Device.findByPk(req.params.id);
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    await device.destroy();
    res.status(200).json({ message: 'Device deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting device', error: error.message });
  }
};

const getDevicesForMap = async (req, res) => {
  try {
    const devices = await Device.findAll({
      attributes: ['id', 'nomor_seri', 'lang', 'long', 'isActive', 'last_seen'],
      include: [
        {
          model: Location,
          attributes: ['id', 'name', 'address', 'lang', 'long'],
        }
      ],
      where: {
        lang: { [Sequelize.Op.ne]: null }, // Only devices with lat/long
        long: { [Sequelize.Op.ne]: null },
      }
    });
    res.status(200).json(devices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching devices for map', error: error.message });
  }
};

module.exports = {
  createDevice,
  getAllDevices,
  getDeviceById,
  updateDevice,
  deleteDevice,
  getDevicesForMap,
  getAllDevicesLocations,
  activeDevice,
  statusDevice
};
