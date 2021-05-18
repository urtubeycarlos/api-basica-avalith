const { describe, it } = require('mocha');
const { beforeEach, afterEach } = require('mocha');
const { assert } = require('chai');
const sinon = require('sinon');
const { createToken } = require('../../services/userService');
const authMiddleware = require('../../middlewares/auth');

function sleep(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), milliseconds);
  });
}

describe.only('Testing auth middleware', () => {
  const req = {
    headers: {
      authorization: '',
    },
  };
  const res = {
    sendStatus: sinon.spy(),
  };
  const next = sinon.spy();

  const fakeUser = {
    email: 'johndoe@gmail.com',
    password: '1234',
  };

  beforeEach(async () => {
    req.headers.authorization = await createToken(fakeUser);
  });

  afterEach(() => {
    res.sendStatus.resetHistory();
    next.resetHistory();
  });

  it('null token', () => {
    req.headers.authorization = null;
    authMiddleware(req, res, next);
    assert.isTrue(res.sendStatus.calledOnceWith(400));
  });

  it('invalid token', () => {
    req.headers.authorization = 'fsafsalkj';
    authMiddleware(req, res, next);
    assert.isTrue(res.sendStatus.calledOnceWith(401));
  });

  it('valid token', () => {
    authMiddleware(req, res, next);
    assert.isTrue(next.calledOnce);
  });

  it('expired token', async () => {
    authMiddleware(req, res, next);
    assert.isTrue(next.calledOnce);
    await sleep(1000);
    authMiddleware(req, res, next);
    assert.isTrue(res.sendStatus.calledOnceWith(401));
  });
});
