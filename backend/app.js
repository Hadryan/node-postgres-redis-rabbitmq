const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config');
const routeConfig = require('./routes');

app
  .use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
  .use(bodyParser.raw({ type: () => true, limit: '5mb' }))
  .use(bodyParser.json({ limit: '50mb' }))
  .use(morgan('dev'))
  .use(cors())
  .use(express.static('wsdl'));

routeConfig(app);

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE');
  res.header('Cache-Control', 'no-store');
  res.header('Cache-Control', 'no-cache');
  res.header('Pragma', 'no-store');
  next();
});

app.set('port', process.env.PORT || config.server.port);

app.timeout = 1000 * 60 * 30;

module.exports = app;
