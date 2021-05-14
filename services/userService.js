const jwt = require('jsonwebtoken');
const md5 = require('md5');
const db = require('../db');
const jwtConfig = require('../config').auth;

function getAll() {
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
  return new Promise((resolve, reject) => {
    db.query('select id, email from user where email = ? and password = ? and active <> 0', [email, md5(password)], (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result[0]);
    });
  });
}

function insert({ email, password }) {
  return new Promise((resolve, reject) => {
    db.query('insert into user values (?, ?)', [email, md5(password)], (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
}

function update({ newPassword, email, password }) {
  return new Promise((resolve, reject) => {
    db.query('update user set password = ?, active = 1 where email = ? and password = ?', [md5(newPassword), email, md5(password)], (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
}

function remove({ email, password }) {
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
  get,
  insert,
  update,
  remove,
  createToken,
};
