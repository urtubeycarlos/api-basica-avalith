const db = require('../db');

function getAll() {
  return new Promise((resolve, reject) => {
    db.query('select id, name, institute from career', (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
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
        reject(error);
      }
      resolve(result);
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
    db.query('', (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
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
        reject(error);
      }
      resolve(result);
    });
  });
}

module.exports = {
  getAll,
  get,
  insert,
  remove,
};
