'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reserva_Xis extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Reserva_Xis.init({
    nome_rx: DataTypes.STRING,
    quantidade_rx: DataTypes.INTEGER,
    data_rx: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'Reserva_Xis',
    //schema: 'dbo'
  });
  return Reserva_Xis;
};