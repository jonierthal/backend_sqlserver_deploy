import express from 'express';

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

  appExpress.listen(3000, () => {
    console.log('server running');
})
// ...

export { appExpress };