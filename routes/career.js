const express = require('express');
const careerService = require('../services/careerService');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await careerService.getAll();
    return res.status(200).send(result);
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await careerService.get(req.params.id);
    return res.status(200).send(result);
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.post('/', async (req, res) => {
  try {
    await careerService.insert(req.body);
    return res.status(200).send({ added: true, msg: 'career added succesfully' });
  } catch (error) {
    if (error.code === 'ER_NOT_FIELD') {
      return res.sendStatus(400);
    }
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).send({ added: false, msg: 'career already exists' });
    }
    return res.sendStatus(500);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await careerService.remove(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(400).send({ deleted: false, msg: 'career not exists' });
    }
    return res.status(200).send({ deleted: true, msg: 'career deleted successfully' });
  } catch (error) {
    if (error.code === 'ER_NOT_ID') {
      return res.sendStatus(400);
    }
    return res.sendStatus(500);
  }
});

/* router.put('/:id', (req, res) => {
  if (!req.body.name || !req.body.institute) {
    return res.sendStatus(400).send({ status: 400, added: false, msg: 'invalid body' });
  }
  return db.query('update career set name = ?, institute = ? where id = ?',
  [req.body.name, req.body.institute, req.body.id], (error, result) => {
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
