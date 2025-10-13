'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Locations', [
      {
        name: 'Desa Suka Maju',
        address: 'Jl. Raya Suka Maju No. 1, Kecamatan Harapan, Kabupaten Sejahtera',
        lang: '-6.200000',
        long: '106.816666',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Balai Desa Suka Maju',
        address: 'Jl. Raya Suka Maju No. 2, Kecamatan Harapan, Kabupaten Sejahtera',
        lang: '-6.201000',
        long: '106.817666',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Locations', null, {});
  }
};