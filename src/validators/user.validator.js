'use strict';
const Joi = require('joi');

const createUserSchema = Joi.object({
  fullName: Joi.string().min(3).required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('super_admin', 'admin', 'admin_user', 'user').required(),
  gender: Joi.string().optional(),
  phone: Joi.string().optional(),
  address: Joi.string().optional(),
});

const registerUserSchema = Joi.object({
  fullName: Joi.string().min(3).required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  gender: Joi.string().optional(),
  phone: Joi.string().optional(),
  address: Joi.string().optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const updateUserSchema = Joi.object({
  fullName: Joi.string().min(3).optional(),
  username: Joi.string().alphanum().min(3).max(30).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(8).optional(), // Allow password changes
  role: Joi.string().valid('super_admin', 'admin', 'admin_user', 'user').optional(),
  gender: Joi.string().optional(),
  phone: Joi.string().optional(),
  address: Joi.string().optional(),
}).min(1); // Require at least one field to be updated

module.exports = {
  createUserSchema,
  loginSchema,
  updateUserSchema,
  registerUserSchema,
};
