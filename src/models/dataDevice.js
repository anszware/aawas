'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DataDevice extends Model {
    static associate(models) {
      DataDevice.belongsTo(models.Device, { foreignKey: 'deviceId' });
    }
  }

  DataDevice.init({
    deviceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    jenis_data: {
      type: DataTypes.ENUM('suhu', 'kelembaban', 'karbon', 'lampu'),
      allowNull: false,
    },
    data: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    recorded_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
  }, {
    sequelize,
    modelName: 'DataDevice',
  });

  return DataDevice;
};
