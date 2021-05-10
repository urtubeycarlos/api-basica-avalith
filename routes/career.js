const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
  console.log(req.body);
  db.query('select * from career', (error, results) => {
    if (error) {
      return res.sendStatus(500);
    }
    return res.status(200).json(results);
  });
});

router.get('/:id', (req, res) => {
  db.query('select * from career where id = ?', req.params.id, (error, result) => {
    if (error) {
      return res.sendStatus(500);
    }
    return res.status(200).json(result);
  });
});

router.post('/', (req, res) => {
  if (!req.fields.name || !req.fields.institute) {
    return res.status(400).json({ status: 400, added: false, msg: 'invalid body' });
  }
  return db.query('insert into career (name, institute) select ?, ? from dual where not exists (select * from career where name = ?)', [req.fields.name, req.fields.institute, req.fields.name], (error, result) => {
    if (error) {
      return res.sendStatus(500);
    }
    if (result.affectedRows === 0) {
      return res.status(400).json({ status: 400, added: false, msg: 'career already exists' });
    }
    return res.status(200).json({ status: 200, added: true, msg: 'career added succesfully' });
  });
});

router.delete('/:id', (req, res) => {
  db.query('delete from career where id = ?', req.params.id, (error, result) => {
    if (error) {
      return res.sendStatus(500);
    }
    if (result.affectedRows === 0) {
      return res.status(400).json({ status: 400, deleted: false, msg: 'career not exists' });
    }
    return res.status(200).json({ status: 200, deleted: true, msg: 'career deleted successfully' });
  });
});

router.put('/:id', (req, res) => {
  if (!req.fields.name || !req.fields.institute) {
    return res.sendStatus(400).json({ status: 400, added: false, msg: 'invalid body' });
  }
  return db.query('update user set name = ?, institute = ? where id = ?', [req.fields.name, req.fields.institute, req.fields.id], (error, result) => {
    if (error) {
      return res.sendStatus(500);
    }
    if (result.affectedRows === 0) {
      return res.status(400).json({ status: 400, updated: false, msg: 'career not exists' });
    }
    return res.status(200).json({ status: 200, updated: true, msg: 'career updated succesfully' });
  });
});

module.exports = router;
