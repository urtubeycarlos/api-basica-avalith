const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
  db.query('select id, name, institute from career', (error, results) => {
    if (error) {
      return res.sendStatus(500);
    }
    return res.status(200).send(results);
  });
});

router.get('/:id', (req, res) => {
  db.query('select id, name, institute from career where id = ?', req.params.id, (error, result) => {
    if (error) {
      return res.sendStatus(500);
    }
    return res.status(200).send(result);
  });
});

router.post('/', (req, res) => {
  if (!req.fields.name || !req.fields.institute) {
    return res.status(400).send({ status: 400, added: false, msg: 'invalid body' });
  }
  return db.query('insert into career (name, institute) values(?, ?)', [req.fields.name, req.fields.institute], (error) => {
    if (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).send({ status: 400, added: false, msg: 'career already exists' });
      }
      return res.sendStatus(500);
    }
    return res.status(200).send({ status: 200, added: true, msg: 'career added succesfully' });
  });
});

router.delete('/:id', (req, res) => {
  db.query('delete from career where id = ?', req.params.id, (error, result) => {
    if (error) {
      return res.sendStatus(500);
    }
    if (result.affectedRows === 0) {
      return res.status(400).send({ status: 400, deleted: false, msg: 'career not exists' });
    }
    return res.status(200).send({ status: 200, deleted: true, msg: 'career deleted successfully' });
  });
});

/* router.put('/:id', (req, res) => {
  if (!req.fields.name || !req.fields.institute) {
    return res.sendStatus(400).send({ status: 400, added: false, msg: 'invalid body' });
  }
  return db.query('update career set name = ?, institute = ? where id = ?',
  [req.fields.name, req.fields.institute, req.fields.id], (error, result) => {
    if (error) {
      return res.sendStatus(500);
    }
    if (result.affectedRows === 0) {
      return res.status(400).send({ status: 400, updated: false, msg: 'career not exists' });
    }
    return res.status(200).send({ status: 200, updated: true, msg: 'career updated succesfully' });
  });
}); */

module.exports = router;
