'use strict';
const Joi = require('joi');

const createDeviceSchema = Joi.object({
  nomor_seri: Joi.string().required(),
  locationId: Joi.number().integer().optional().allow(null),
  ip: Joi.string().ip().optional().allow(null),
  mac_address: Joi.string().pattern(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/).optional().allow(null),
  lang: Joi.string().optional().allow(null),
  long: Joi.string().optional().allow(null),
  isActive: Joi.boolean().optional().default(false),
});

const updateDeviceSchema = Joi.object({
  nomor_seri: Joi.string().optional(),
  locationId: Joi.number().integer().optional().allow(null),
  ip: Joi.string().ip().optional().allow(null),
  mac_address: Joi.string().pattern(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/).optional().allow(null),
  lang: Joi.string().optional().allow(null),
  long: Joi.string().optional().allow(null),
  isActive: Joi.boolean().optional(),
}).min(1);
const activeDeviceSchema = Joi.object({
  nomor_seri: Joi.string().optional(),
  ip: Joi.string().ip(),
  mac_address: Joi.string().pattern(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/),
  lang: Joi.string(),
  long: Joi.string(),
  isActive: Joi.boolean().optional(),
}).min(1);

module.exports = {
  createDeviceSchema,
  updateDeviceSchema,
  activeDeviceSchema
};
