require('dotenv').config();
const jwt = require('jsonwebtoken');

const { NOT_FOUND_USER } = require('../constants');
const Unauthorized = require('../errors/Unauthorized');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  const JWT = req.cookies.jwt;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    if (!JWT) {
      throw next(new Unauthorized(NOT_FOUND_USER));
    }
  }

  const token = !authorization ? JWT : authorization.replace('Bearer ', '');
  let payload = '';

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw next(new Unauthorized(NOT_FOUND_USER));
  }

  req.user = payload;
  return next();
};

module.exports = {
  auth,
};
