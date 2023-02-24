import { Sequelize } from 'sequelize';
require('dotenv').config();

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const dbHost = process.env.DB_HOST;

//Ligação com o banco de dados
const sequelizeCon = new Sequelize(
    dbName || "aorung_almocopcr",
    dbUser || "aorung_jonathae",
    dbPass || "!Joer1818",
     {
        host: dbHost || "mysql-ag-br1-11.conteige.cloud",
        dialect: 'mysql',
   });

//Autenticação do banco, e retorno do status de conexão
sequelizeCon.authenticate()
    .then(() => {
        console.log('Db connection OK!');
    }).catch(e => {
        console.log('Db connection error', e);
    })

sequelizeCon.sync({ force: true }).then(() => {
    console.log('Tabelas sincronizadas com sucesso');
});

    export { sequelizeCon };
    
