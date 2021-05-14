const { describe, it, beforeEach } = require('mocha');
const { assert } = require('chai');
const { createToken } = require('../../services/userService');
const authMiddleware = require('../../middlewares/auth');
require('dotenv').config();

function sleep(milliseconds) {
  const start = new Date().getTime();
  for (let i = 0; i < 1e7; i += 1) {
    if ((new Date().getTime() - start) > milliseconds) {
      break;
    }
  }
}

describe('Testing auth middleware', () => {
  const req = {
    headers: {
      authorization: '',
    },
  };
  const res = {
    sendStatus: (httpError) => httpError,
  };
  const next = () => 'next!';

  beforeEach(async () => {
    const fakeUser = {
      email: 'johndoe@gmail.com',
      password: '1234',
    };
    req.headers.authorization = await createToken(fakeUser);
  });

  it('null token', () => {
    req.headers.authorization = null;
    assert.equal(authMiddleware(req, res, next), 400);
  });

  it('invalid token', () => {
    req.headers.authorization = 'fsafsalkj';
    assert.equal(authMiddleware(req, res, next), 401);
  });

  it('valid token', () => {
    assert.equal(authMiddleware(req, res, next), 'next!');
  });

  it('expired token', () => {
    assert.equal(authMiddleware(req, res, next), 'next!');
    sleep(1000);
    assert.equal(authMiddleware(req, res, next), 401);
  });
});
