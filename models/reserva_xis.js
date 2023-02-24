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
      Reserva_Xis.belongsTo(models.Funcionario, {
        foreignKey: 'cod_funcionario',
      })    }
  }
  Reserva_Xis.init({
    cod_funcionario: DataTypes.INTEGER,
    quantidade_rx: DataTypes.INTEGER,
    date_rx: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'Reserva_Xis',
  });
  return Reserva_Xis;
};