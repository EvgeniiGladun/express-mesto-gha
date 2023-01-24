require('dotenv').config();
const jwt = require('jsonwebtoken');

const { UNAUTHORIZED, NOT_FOUND_USER } = require('../constants');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(UNAUTHORIZED).send({ message: NOT_FOUND_USER });
  }

  const token = authorization.replace('Bearer ', '');
  let payload = '';

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(UNAUTHORIZED).send(NOT_FOUND_USER);
  }

  req.user = payload;
  return next();
};

module.exports = {
  auth,
};
