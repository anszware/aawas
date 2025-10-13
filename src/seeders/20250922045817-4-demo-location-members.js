'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('LocationMembers', [
      {
        locationId: 1, // Desa Suka Maju
        userId: 2,     // Petugas Lapangan
        role_member: 'petugas',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        locationId: 1, // Desa Suka Maju
        userId: 3,     // Admin Desa Suka Maju
        role_member: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        locationId: 1, // Desa Suka Maju
        userId: 4,     // Warga Suka Maju
        role_member: 'warga',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        locationId: 2, // Balai Desa Suka Maju
        userId: 3,     // Admin Desa Suka Maju is also admin for Balai Desa
        role_member: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('LocationMembers', null, {});
  }
};