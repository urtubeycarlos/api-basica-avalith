const express = require('express');
const md5 = require('md5');
const db = require('../db');

const router = express.Router();

router.post('/login', (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ status: 400, logged: false, msg: 'invalid body' });
  }
  return db.query('select email, password, active from user where email = ? and password = ? and active <> 0', [req.body.email, md5(req.body.password)], (error, result) => {
    if (error) {
      return res.sendStatus(500);
    }
    if (result.length === 0) {
      return res.status(400).send({ status: 400, logged: false, msg: 'invalid email or password' });
    }
    req.session.user = req.body.email;
    return res.status(200).send({ status: 200, logged: true, msg: 'logged succesfully' });
  });
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  return res.status(200).send({ status: 200, logged: false });
});

router.post('/signup', (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ status: 400, signup: false, msg: 'invalid body' });
  }
  return db.query('insert into user (email, password) values(?, ?)', [req.body.email, md5(req.body.password)], (error) => {
    if (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).send({ status: 400, signup: false, msg: 'user already exists' });
      }
      return res.sendStatus(500);
    }
    return res.status(200).send({ status: 200, signup: true, msg: 'user added successfully' });
  });
});

router.put('/changepassword', (req, res) => {
  if (!req.body.email || !req.body.password || !req.body.newPassword) {
    return res.status(400).send({ status: 400, password_changed: false, msg: 'invalid body' });
  }
  return db.query('update user set password = ? where email = ? and password = ?', [md5(req.body.newPassword), req.body.email, md5(req.body.password)], (error, result) => {
    if (error) {
      return res.sendStatus(500);
    }
    if (result.affectedRows === 0) {
      return res.status(400).send({ status: 400, password_changed: false, msg: 'invalidad email or password' });
    }
    return res.status(200).send({ status: 200, password_changed: true, msg: 'password changed' });
  });
});

router.delete('/signdown', (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ status: 400, signdown: false, msg: 'invalid body' });
  }
  return db.query('update user set active = 0 where email = ? and password = ?', [req.body.email, md5(req.body.password)], (error, result) => {
    if (error) {
      return res.sendStatus(500);
    }
    if (result.affectedRows === 0) {
      return res.status(400).send({ status: 400, signdown: false, msg: 'invalid email or password' });
    }
    return res.status(200).send({ status: 200, signdown: false, msg: 'user eliminated succesfully' });
  });
});

module.exports = router;
