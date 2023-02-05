const joi = require('joi');

const email = joi.string().email();
const password = joi.string().min(8);
const token = joi.string();


const recoverySchema = joi.object({
  email: email.required(),
});

const updatePasswordSchema = joi.object({
  password: password.required(),
  token: token.required(),
});

module.exports = { recoverySchema, updatePasswordSchema }
