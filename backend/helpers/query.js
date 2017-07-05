const Pool = require('pg').Pool;
const config = require('../config');

const pg = new Pool(config.postgres);

const query = (queryText, queryValues, cb) => {
  if (typeof queryValues === 'function') {
    cb = queryValues;
    queryValues = null;
  }

  pg.connect((err, client, release) => {
    if (err) return cb(err);
       
    client.query(queryText, queryValues, (err, result) => {
      release();
         
      if (err) return cb(err);
         
      return cb(null, result.rows, result);
    });
  });
};

module.exports = query;