'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Device extends Model {
    static associate(models) {
      Device.belongsTo(models.Location, { foreignKey: 'locationId' });
      Device.hasMany(models.DataDevice, { foreignKey: 'deviceId' });
    }
  }

  Device.init({
    nomor_seri: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    locationId: DataTypes.INTEGER,
    ip: DataTypes.STRING,
    mac_address: DataTypes.STRING,
    lang: DataTypes.STRING,
    long: DataTypes.STRING,
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    last_seen: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Device',
  });

  return Device;
};
