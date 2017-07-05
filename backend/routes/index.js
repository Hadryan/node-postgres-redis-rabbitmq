const tokenMiddleware = require('../helpers/jwt').tokenMiddleware;

module.exports = (app) => {
  app.use('/', require('./auth'));
  app.use('/*', tokenMiddleware);
  app.use('/', require('./projects'));
};