'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cars extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      cars.belongsTo(models.login, {
        foreignKey: "createdBy",
        as: "created",
      });
      cars.belongsTo(models.login, {
        foreignKey: "updatedBy",
        as: "updated",
      });
      cars.belongsTo(models.login, {
        foreignKey: "deletedBy",
        as: "deleted",
      });
    }
  }
  cars.init({
    name: DataTypes.STRING,
    rent_price: DataTypes.FLOAT,
    size: DataTypes.STRING,
    image_url: DataTypes.STRING,
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER,
    deletedBy: DataTypes.INTEGER,
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'cars',
  });
  return cars;
};