const joi = require('joi');

const id = joi.number().integer();
const name = joi.string();
const email = joi.string().email();
const password = joi.string().min(8);

const createUserSchema = joi.object({
  name: name.required(),
  email: email.required(),
  password: password.required(),
});

const updateUserSchema = joi.object({
  name: name,
  email: email,
});

const getUserSchema = joi.object({
  id: id.required(),
});

module.exports = { getUserSchema, createUserSchema, updateUserSchema };
