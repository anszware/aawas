'use strict';
const Joi = require('joi');

const createLocationSchema = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().optional(),
  lang: Joi.string().optional(),
  long: Joi.string().optional(),
});
const createLocationUserSchema = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().optional(),
  lang: Joi.string().optional(),
  long: Joi.string().optional(),
  userId: Joi.number().optional(),
});

const updateLocationSchema = Joi.object({
  name: Joi.string().optional(),
  address: Joi.string().optional(),
  lang: Joi.string().optional(),
  long: Joi.string().optional(),
}).min(1);

module.exports = {
  createLocationSchema,
  updateLocationSchema,
  createLocationUserSchema,
};
