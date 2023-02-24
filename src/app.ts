import express from 'express';
import { sequelizeCon } from './config';
require('dotenv').config();

//variavel de ambiente porta do servidor remoto
const dbPort = process.env.DB_PORT;

// Configuração do servidor Express
const appExpress = express();
const bodyParser = require('body-parser');

appExpress.use(bodyParser.urlencoded({ extended: true }));
appExpress.use(bodyParser.json());

appExpress.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    next();
  });

  sequelizeCon.sync().then(() => {
    appExpress.listen(3000, () => {
      console.log('Servidor rodando na porta ' + dbPort + '!');
    });
  }).catch(error => {
    console.log('Erro ao sincronizar com o banco de dados:', error);
  });
// ...

export { appExpress };