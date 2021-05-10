const express = require('express');
const md5 = require('md5');
const db = require('../db');

const router = express.Router();

router.post('/login', (req, res) => {
  if (!req.fields.email || !req.fields.password) {
    return res.status(400).json({ status: 400, logged: false, msg: 'invalid body' });
  }
  return db.query('select * from user where email = ? and password = ?', [req.fields.email, md5(req.fields.password)], (error, result) => {
    console.log(result);
    if (error) {
      return res.sendStatus(500);
    }
    if (result.length === 0) {
      return res.status(400).json({ status: 400, logged: false });
    }
    req.session.user = req.fields.email;
    return res.status(200).json({ status: 200, logged: true });
  });
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  return res.status(200).json({ status: 200, logged: false });
});

router.post('/signup', (req, res) => {
  if (!req.fields.email || !req.fields.password) {
    return res.status(400).json({ status: 400, signup: false, msg: 'invalid body' });
  }
  db.query('insert into user (email, password) select ?, MD5(?) from dual where not exists ( select * from user where email = ? )', [req.fields.email, req.fields.password, req.fields.email], (error, result) => {
    if (error) {
      return res.sendStatus(500);
    }
    if (result.affectedRows === 0) {
      return res.status(400).json({ status: 400, signup: false, msg: 'user already exists' });
    }
  });
  return res.status(200).json({ status: 200, signup: true, msg: 'user added successfully' });
});

router.put('/changepassword', (req, res) => {
  if (!req.fields.email || !req.fields.password || !req.fields.newPassword) {
    return res.status(400).json({ status: 400, password_changed: false, msg: 'invalid body' });
  }
  db.query('update user set password = MD5(?) where email = ? and password = MD5(?)', [req.fields.newPassword, req.fields.email, req.fields.password], (error, result) => {
    if (error) {
      return res.sendStatus(500);
    }
    if (result.affectedRows === 0) {
      return res.status(400).json({ status: 400, password_changed: false, msg: 'invalidad email or password' });
    }
    return res.status(200).json({ status: 200, password_changed: true, msg: 'password changed' });
  });
});

router.delete('/signdown', (req, res) => {
  if (!req.fields.email || !req.fields.password) {
    return res.status(400).json({ status: 400, signdown: false, msg: 'invalid body' });
  }
  db.query('delete from user where email = ? and password = MD5(?)', [req.fields.email, req.fields.password], (error, result) => {
    if (error) {
      return res.sendStatus(500);
    }
    if (result.affectedRows === 0) {
      return res.status(400).json({ status: 400, signdown: false, msg: 'invalid email or password' });
    }
    return res.status(200).json({ status: 200, signdown: false, msg: 'user eliminated succesfully' });
  });
});

module.exports = router;
