'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Location extends Model {
    static associate(models) {
      Location.hasMany(models.Device, { foreignKey: 'locationId' });
      Location.hasMany(models.LocationMember, { foreignKey: 'locationId' });
    }
  }

  Location.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: DataTypes.TEXT,
    lang: DataTypes.STRING,
    long: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Location',
  });

  return Location;
};
