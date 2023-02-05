const UserService = require("./user.service");
const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { config } = require("../config/config");
const sendMail = require('./../utils/mail/index');

const service = new UserService();

class AuthService {
  async getUser(email, password) {
    const user = await service.findByEmail(email);

    if (!user) throw boom.unauthorized("User not found");

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) throw boom.unauthorized("Password don't match");

    delete user.dataValues.password;
    delete user.dataValues.recoveryToken;

    return user;
  }

  signToken(user) {
    const token = jwt.sign({ userId: user.id, }, config.jwtSecret, { expiresIn: '2m' });
    const refreshToken = jwt.sign({ userId: user.id, }, config.jwtRefreshSecret, { expiresIn: '5m' });

    return { user, token, refreshToken };
  }

  refreshSignToken(user) {
    const token = jwt.sign({ userId: user.id, }, config.jwtRefreshSecret, { expiresIn: '7d' });

    return { token };
  }

  async recovery(email) {
    const user = await service.findByEmail(email);

    if (!user) throw boom.unauthorized("User not found");

    const recoveryToken = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: '10min' });

    await service.update(user.id, { recoveryToken });

    const mail = await sendMail(user.email, 'Password recovery 🔒', `<p>${recoveryToken}</p>`);

    return mail;
  }

  async changePassword(token, password) {
    try {
      const payload = jwt.verify(token, config.jwtSecret);

      const user = await service.findOne(payload.userId);

      if (user.recoveryToken !== token) throw boom.unauthorized("Token don't match");

      const hash = await bcrypt.hash(password, 10);

      await service.update(user.id, { password: hash, recoveryToken: null });

      return 'password updated';
    } catch (error) {
      throw boom.unauthorized("Failed on verify token");
    }
  }
}

module.exports = AuthService;
