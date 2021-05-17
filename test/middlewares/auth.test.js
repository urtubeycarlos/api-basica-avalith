const { describe, it, beforeEach } = require('mocha');
const { assert } = require('chai');
const { createToken } = require('../../services/userService');
const authMiddleware = require('../../middlewares/auth');

function sleep(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), milliseconds);
  });
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

  const fakeUser = {
    email: 'johndoe@gmail.com',
    password: '1234',
  };

  beforeEach(async () => {
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

  it('expired token', async () => {
    assert.equal(authMiddleware(req, res, next), 'next!');
    await sleep(1000);
    assert.equal(authMiddleware(req, res, next), 401);
  });
});
