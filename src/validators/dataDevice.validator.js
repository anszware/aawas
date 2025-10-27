'use strict';
const Joi = require('joi');

const createDataDeviceSchema = Joi.object({
  nomor_seri_device: Joi.string().required(),
  jenis_data: Joi.string().valid('suhu', 'kelembaban','relay','PM10','PM2.5','CO','NOx','SO2','O3','HC').required(),
  data: Joi.number().required(),
});

module.exports = {
  createDataDeviceSchema,
};
