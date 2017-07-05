const query = require('../helpers/query');

const create = (data, cb) => {
  const values = [data.title];

  return query('INSERT INTO projects (title) VALUES($1)', values, cb);
};

const find = (title, cb) => {
  const values = [title];

  return query('SELECT * FROM projects WHERE title = $1', values, cb);
};

const getAll = (cb) => query('SELECT * FROM projects', cb);

const remove = (projId, cb) => {
  const values = [projId];

  return query('DELETE FROM projects WHERE id = $1', values, cb);
};

const update = (data, cb) => {
  const values = [data.title, data.projId];

  return query('UPDATE projects SET title = $1 WHERE id = $2', values, cb);
};

module.exports = {
  create,
  find,
  getAll,
  remove,
  update
};