const jwt = require('jsonwebtoken');
const config = require('../config');

const verifyToken = (token, cb) => {
  jwt.verify(token, config.jwtsecret, (err, decoded) => {
    if (err) cb(err);

    cb(null, decoded);
  });
};

const createToken = (user) => jwt.sign(user, config.jwtsecret);

const tokenMiddleware = (req, res, next) => {
  let token = req.headers.authorization || req.body.token || req.query.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Please provide a valid token'
    });
  }

  if (~token.indexOf('Bearer')) {
    token = token.replace('Bearer ', '');
  }

  verifyToken(token, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Token invalid'
      });
    }

    req.user = user;
    req.token = token;
    next();
  });
};

module.exports = {
  createToken,
  verifyToken,
  tokenMiddleware
};
