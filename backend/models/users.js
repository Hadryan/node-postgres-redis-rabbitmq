const query = require('../helpers/query');

const create = (data, cb) => {
  const values = [data.username, data.password];

  return query('INSERT INTO users (username, password) VALUES($1, $2) RETURNING username, id', values, cb);
};

const find = (username, cb) => {
  const values = [username];

  return query('SELECT id, username FROM users WHERE username = $1', values, cb);
};

const authenticate = (data, cb) => {
  const values = [data.username, data.password];

  return query('SELECT id, username FROM users WHERE username = $1 AND password = $2', values, cb);
};

module.exports = {
  create,
  find,
  authenticate
};