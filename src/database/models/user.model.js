const { Model, DataTypes } = require('sequelize');

const USER_TABLE = 'users';

const UserSchema = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  recoveryToken: {
    field: "recovery_token",
    type: DataTypes.TEXT,
    allowNull: true,
  },
};

class User extends Model {
  static associate(models) {
    /**
     * Here your relations
     *
     * example:
     * this.relationType(models.Model,{as: 'alias', foreignKey: 'key'});
     */
  }

  static config(sequelize) {
    return { sequelize, tableName: USER_TABLE, modelName: 'User' };
  }
}

module.exports = { USER_TABLE, UserSchema, User };
