'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    await queryInterface.bulkInsert('Users', [
      {
        fullName: 'Super Admin',
        username: 'superadmin',
        email: 'superadmin@example.com',
        password: hashedPassword,
        role: 'super_admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        fullName: 'Petugas Lapangan',
        username: 'petugas01',
        email: 'petugas01@example.com',
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        fullName: 'Admin Desa Suka Maju',
        username: 'admindesa_sukamaju',
        email: 'admindesa.sukamaju@example.com',
        password: hashedPassword,
        role: 'admin_user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        fullName: 'Warga Suka Maju',
        username: 'warga01_sukamaju',
        email: 'warga01.sukamaju@example.com',
        password: hashedPassword,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};