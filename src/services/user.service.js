const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const { models } = require('./../libs/sequelize');

class UserService {
  async create(name, email, password) {
    const hash = await bcrypt.hash(password, 10);
    const user = await models.User.create({ name, email, password: hash });

    delete user.dataValues.password;
    delete user.dataValues.recoveryToken;
    return user;
  }

  async find() {
    const users = await models.User.findAll({
      attributes: {
        exclude: ['password']
      }
    });
    return users;
  }

  async findOne(id) {
    const user = await models.User.findByPk(id);

    if (!user) throw boom.notFound("User not found");
    return user;
  }

  async findByEmail(email) {
    const user = await models.User.findOne({ where: { email } });
    return user;
  }

  async update(id, changes) {
    const user = await this.findOne(id);
    const updated = await user.update(changes);

    return updated;
  }

  async delete(id) {
    const user = await this.findOne(id);
    await user.destroy();
    return { id };
  }
}

module.exports = UserService;
