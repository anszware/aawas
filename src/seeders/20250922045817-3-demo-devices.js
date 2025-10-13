'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Devices', [
      {
        nomor_seri: 'SN-TEMP-001',
        locationId: 1, // Desa Suka Maju
        isActive: true,
        last_seen: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nomor_seri: 'SN-LAMP-001',
        locationId: 2, // Balai Desa Suka Maju
        isActive: true,
        last_seen: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nomor_seri: 'SN-CARB-001',
        locationId: 1, // Desa Suka Maju
        isActive: false,
        last_seen: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nomor_seri: 'SN-UNASSIGNED-001',
        locationId: null, // Not assigned to any location
        isActive: false,
        last_seen: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Devices', null, {});
  }
};