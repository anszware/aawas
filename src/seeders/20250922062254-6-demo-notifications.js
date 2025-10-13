'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Notifications', [
      {
        userId: 1, // Super Admin
        message: 'Selamat datang di sistem IoT Anda!',
        type: 'success',
        isRead: false,
        link: '/dashboard',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2, // Petugas Lapangan
        message: 'Perangkat SN-TEMP-001 di Desa Suka Maju offline.',
        type: 'error',
        isRead: false,
        link: '/devices/1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 3, // Admin Desa Suka Maju
        message: 'Laporan bulanan lokasi Desa Suka Maju sudah tersedia.',
        type: 'info',
        isRead: false,
        link: '/reports/monthly',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 4, // Warga Suka Maju
        message: 'Suhu di area Anda saat ini 28.5°C.',
        type: 'info',
        isRead: true, // Already read
        link: '/data/suhu',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 1, // Super Admin
        message: 'User baru "warga01_sukamaju" telah terdaftar.',
        type: 'alert',
        isRead: false,
        link: '/users/4',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Notifications', null, {});
  }
};