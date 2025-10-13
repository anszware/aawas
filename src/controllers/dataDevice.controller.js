'use strict';
const { DataDevice, Device, Location } = require('../models');

const createDataDevice = async (req, res) => {
  try {
    const { nomor_seri_device, jenis_data, data } = req.body;

    const device = await Device.findOne({ where: { nomor_seri: nomor_seri_device } });
    if (!device) {
      return res.status(404).json({ message: 'Device not found with provided serial number' });
    }

    const newDataDevice = await DataDevice.create({
      deviceId: device.id,
      jenis_data,
      data,
      recorded_at: new Date(),
    });

    // Update device's last_seen and isActive status
    await device.update({ last_seen: new Date(), isActive: true });

    res.status(201).json({ message: 'Data device created successfully', data: newDataDevice });
  } catch (error) {
    res.status(500).json({ message: 'Error creating data device', error: error.message });
  }
};

const getDataDeviceByCategory = async (req, res) => {
  try {
    const { jenis_data } = req.params;

    if (!['suhu', 'kelembaban', 'karbon', 'lampu'].includes(jenis_data)) {
      return res.status(400).json({ message: 'Invalid data category' });
    }

    const dataDevices = await DataDevice.findAll({
      where: { jenis_data },
      include: [
        {
          model: Device,
          attributes: ['id', 'nomor_seri', 'isActive', 'last_seen'],
          include: [
            { model: Location, attributes: ['id', 'name', 'address', 'lang', 'long'] }
          ]
        }
      ],
      order: [['recorded_at', 'DESC']]
    });

    res.status(200).json(dataDevices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data devices by category', error: error.message });
  }
};

module.exports = {
  createDataDevice,
  getDataDeviceByCategory,
};
