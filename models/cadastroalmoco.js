'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CadastroAlmoco extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CadastroAlmoco.belongsTo(models.Funcionario, {
        foreignKey: 'cod_funcionario',
      })
    }
  }
  CadastroAlmoco.init({
    cod_funcionario: DataTypes.INTEGER,
    confirma: DataTypes.BOOLEAN,
    data_cadastro: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'CadastroAlmoco',
    schema: 'dbo'
  });
  return CadastroAlmoco;
};