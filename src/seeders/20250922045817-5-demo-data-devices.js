'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('DataDevices', [
      // Data for Device 1 (SN-TEMP-001)
      {
        deviceId: 1,
        jenis_data: 'suhu',
        data: 28.5,
        recorded_at: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        deviceId: 1,
        jenis_data: 'kelembaban',
        data: 75,
        recorded_at: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Data for Device 2 (SN-LAMP-001)
      {
        deviceId: 2,
        jenis_data: 'lampu',
        data: 1, // 1 for ON
        recorded_at: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Data for Device 3 (SN-CARB-001) - though it's inactive, maybe it sent data before
      {
        deviceId: 3,
        jenis_data: 'karbon',
        data: 400.2,
        recorded_at: new Date(new Date().getTime() - (24 * 60 * 60 * 1000)), // 1 day ago
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('DataDevices', null, {});
  }
};