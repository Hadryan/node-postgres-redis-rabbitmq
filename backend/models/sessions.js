const client = require('../helpers/redis');
const expireTime = 60 * 5;

const create = (username, sessionToken, cb) => {
  client.hset(username, 'sessionToken', sessionToken, (err, res) => {
    if (err) return cb(err);

    client.expire(username, expireTime);
    return cb(null, res);
  });
};

const find = (username, cb) => client.hget(username, 'sessionToken', cb);

module.exports = {
  create,
  find
};