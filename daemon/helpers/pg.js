const Pool = require('pg').Pool;
const config = require('../config');

const pg = new Pool(config.postgres);

const connection = (cb) =>
  pg.connect((err, client, release) => {
    if (err) return handleError(err);

    console.log('\n\\_/ Daemon connected to Postgres');

    cb(client);
  });

const handleError = (err) => {
  console.log("Postgres Error: ", err);
  process.exit(1);
};

module.exports = connection;

