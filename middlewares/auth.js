const jwt = require('jsonwebtoken');
const jwtConfig = require('../config').auth;

const auth = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    return jwt.verify(token, jwtConfig.privateKey, (error, decoded) => {
      if (error) {
        return res.sendStatus(401);
      }
      req.decoded = decoded;
      return next();
    });
  }
  return res.sendStatus(400);
};

module.exports = auth;
