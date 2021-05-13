const express = require('express');
const userService = require('../services/userService');

const router = express.Router();

router.post('/login', async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.sendStatus(400);
  }
  try {
    const user = await userService.get(req.body);
    if (!user) {
      return res.status(403).send({ logged: false, msg: 'invalid email or password' });
    }
    try {
      const encodedToken = await userService.createToken(user);
      return res.status(202).send({ logged: true, msg: 'logged succesfully', token: encodedToken });
    } catch (error) {
      return res.sendStatus(403);
    }
  } catch (error) {
    return res.sendStatus(500);
  }
});

/* router.post('/logout', (req, res) => {
  req.session.destroy();
  return res.status(200).send({ status: 200, logged: false });
}); */

router.post('/signup', async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.sendStatus(400);
  }
  try {
    await userService.insert(req.body);
    return res.status(200).send({ signup: true, msg: 'user added successfully' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      try {
        req.body.newPassword = req.body.password;
        await userService.update(req.body);
        return res.status(200).send({ signup: true, msg: 'user actived successfully' });
      } catch {
        return res.sendStatus(500);
      }
    }
    return res.sendStatus(500);
  }
});

router.put('/changepassword', async (req, res) => {
  if (!req.body.email || !req.body.password || !req.body.newPassword) {
    return res.status(400);
  }
  try {
    const result = await userService.update(req.body);
    if (result.affectedRows === 0) {
      return res.status(400).send({ password_changed: false, msg: 'invalidad email or password' });
    }
    return res.status(200).send({ password_changed: true, msg: 'password changed' });
  } catch (error) {
    return res.sendStatus(500);
  }
});

router.delete('/signdown', async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400);
  }
  try {
    const result = await userService.remove(req.body);
    if (result.affectedRows === 0) {
      return res.status(400).send({ signdown: false, msg: 'invalid email or password' });
    }
    return res.status(200).send({ status: 200, signdown: false, msg: 'user eliminated succesfully' });
  } catch (error) {
    return res.sendStatus(500);
  }
});

module.exports = router;
