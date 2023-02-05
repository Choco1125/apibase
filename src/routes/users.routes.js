const { Router } = require('express');
const UserService = require('./../services/user.service');
const validationHandler = require('./../middleware/validationHandler');
const { createUserSchema, getUserSchema, updateUserSchema } = require('./../schemas/users.schema');
const boom = require('@hapi/boom');
const passport = require('passport');

const router = Router();
const service = new UserService();

router.get('/', async (req, res, next) => {
  try {
    const users = await service.find();
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
});

router.post(
  '/',
  validationHandler(createUserSchema, 'body'),
  async (req, res, next) => {
    try {
      const { name, email, password } = req.body;

      const registeredUser = await service.findByEmail(email);

      if (registeredUser) throw boom.unauthorized("User already exits");

      const user = await service.create(name, email, password);
      res.status(201).json({ user });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  validationHandler(getUserSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await service.findOne(id);

      delete user.dataValues.password;
      delete user.dataValues.recoveryToken;

      res.status(200).json({ user })
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  validationHandler(getUserSchema, 'params'),
  validationHandler(updateUserSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;

      const user = await service.update(id, body);

      delete user.dataValues.password;
      delete user.dataValues.recoveryToken;

      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  validationHandler(getUserSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await service.delete(id);
      res.status(200).json({ user });

    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
