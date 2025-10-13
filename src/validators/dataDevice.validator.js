'use strict';
const Joi = require('joi');

const createDataDeviceSchema = Joi.object({
  nomor_seri_device: Joi.string().required(),
  jenis_data: Joi.string().valid('suhu', 'kelembaban', 'karbon', 'lampu').required(),
  data: Joi.number().required(),
});

module.exports = {
  createDataDeviceSchema,
};
