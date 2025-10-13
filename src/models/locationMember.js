'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LocationMember extends Model {
    static associate(models) {
      LocationMember.belongsTo(models.User, { foreignKey: 'userId' });
      LocationMember.belongsTo(models.Location, { foreignKey: 'locationId' });
    }
  }

  LocationMember.init({
    locationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    role_member: {
      type: DataTypes.ENUM('admin', 'petugas', 'warga'),
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'LocationMember',
  });

  return LocationMember;
};
