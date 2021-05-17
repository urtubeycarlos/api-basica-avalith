const jwt = require('jsonwebtoken');
const md5 = require('md5');
const db = require('../db');
const jwtConfig = require('../config').auth;

function checkParameters(...params) {
  let acum = false;
  for (let i = 0; i < params.length; i += 1) {
    const param = params[i];
    acum = acum || !param;
  }
  if (acum) {
    const error = new Error('Empty parameter');
    error.code = 'ER_NOT_PARAM';
    throw error;
  }
}

function getAll() {
  return new Promise((resolve, reject) => {
    db.query('select id, email, active from user where active <> 0', (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
}

function getAllWithInactive() {
  return new Promise((resolve, reject) => {
    db.query('select id, email, active from user', (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
}

function get({ email, password }) {
  checkParameters(email, password);
  return new Promise((resolve, reject) => {
    db.query('select id, email from user where email = ? and password = ? and active <> 0', [email, md5(password)], (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve((result[0] === undefined) ? {} : result[0]);
    });
  });
}

function update({ newPassword, email, password }) {
  checkParameters(newPassword, email, password);
  return new Promise((resolve, reject) => {
    db.query('update user set password = ?, active = 1 where email = ? and password = ?', [md5(newPassword), email, md5(password)], (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
}

function insert({ email, password }) {
  checkParameters(email, password);
  return new Promise((resolve, reject) => {
    db.query('insert into user values (?, ?)', [email, md5(password)], (error, result) => {
      if (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          return resolve(update({ newPassword: password, email, password }));
        }
        return reject(error);
      }
      return resolve(result);
    });
  });
}

function remove({ email, password }) {
  checkParameters(email, password);
  return new Promise((resolve, reject) => {
    db.query('update user set active = 0 where email = ? and password = ?', [email, md5(password)], (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
}

function createToken(user) {
  if (!user || Object.keys(user).length === 0) {
    const error = new Error('Not user passed as parameter');
    error.code = 'ER_NOT_USER';
    throw error;
  }
  const options = {
    algorithm: jwtConfig.algorithm,
    expiresIn: jwtConfig.expire,
  };
  const payload = JSON.parse(JSON.stringify(user));
  return new Promise((resolve, reject) => {
    jwt.sign(payload, jwtConfig.privateKey, options, (encodeError, encoded) => {
      if (encodeError) {
        return reject(encodeError);
      }
      return resolve(encoded);
    });
  });
}

module.exports = {
  getAll,
  getAllWithInactive,
  get,
  insert,
  update,
  remove,
  createToken,
};
