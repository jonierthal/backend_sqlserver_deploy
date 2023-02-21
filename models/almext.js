'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AlmExt extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AlmExt.init({
    nome_aext: DataTypes.STRING,
    quantidade_aext: DataTypes.INTEGER,
    date_aext: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'AlmExt',
    //schema: 'dbo'
  });
  return AlmExt;
};