const redis = require('redis');
const config = require('../config');

const client = redis.createClient(config.redis);

client.on('error', (err) => {
  console.dir(err);
  process.exit(1);
});

module.exports = client;