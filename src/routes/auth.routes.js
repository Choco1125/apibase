const { Router } = require('express');
const passport = require('passport');
const AuthService = require('./../services/auth.service');
const validationHandler = require('./../middleware/validationHandler');
const { recoverySchema, updatePasswordSchema } = require('./../schemas/auth.schema');

const router = Router();
const service = new AuthService();

router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  async (req, res, next) => {
    try {
      const user = req.user;
      res.status(200).json(service.signToken(user));
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/refresh',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const { userId } = req.user;
      res.status(200).json(service.refreshSignToken(userId));
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/recovery',
  validationHandler(recoverySchema, 'body'),
  async (req, res, next) => {
    try {
      const { email } = req.body;
      const recovery = await service.recovery(email);

      res.status(200).json({ message: recovery });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/change-password',
  validationHandler(updatePasswordSchema, 'body'),
  async (req, res, next) => {
    try {
      const { password, token } = req.body;
      const recovery = await service.changePassword(token, password);

      res.status(200).json({ message: recovery });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
