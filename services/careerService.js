const db = require('../db');

function getAll() {
  return new Promise((resolve, reject) => {
    db.query('select id, name, institute from career', (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
}

function get(id) {
  if (!id) {
    const error = new Error('id must be provided');
    error.code = 'ER_NOT_ID';
    throw error;
  }
  return new Promise((resolve, reject) => {
    db.query('select id, name, institute from career where id = ?', [id], (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve((result[0] === undefined) ? {} : result[0]);
    });
  });
}

function insert({ name, institute }) {
  if (!name || !institute) {
    const error = new Error(`Invalid parameters. name = ${name}, institute = ${institute}`);
    error.code = 'ER_NOT_FIELD';
    throw error;
  }
  return new Promise((resolve, reject) => {
    db.query('insert into career (name, institute) values (?, ?)', [name, institute], (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
}

function remove(id) {
  if (!id) {
    const error = new Error('id must be provided');
    error.code = 'ER_NOT_ID';
    throw error;
  }
  return new Promise((resolve, reject) => {
    db.query('delete from career where id = ?', id, (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
}

module.exports = {
  getAll,
  get,
  insert,
  remove,
};
