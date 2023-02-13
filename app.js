require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { Joi, celebrate, errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const users = require('./routes/users');
const cards = require('./routes/cards');

const {
  NOT_FOUND_PAGE,
  SERVER_ERROR,
  INTERNAL_SERVER_ERROR_MESSAGE,
  allowedCors,
  RegExpUrl,
} = require('./constants');
const { auth } = require('./middlewares/auth');

const { login, logOut, createUser } = require('./controllers/users');
const NotFoundError = require('./errors/NotFoundError');

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Парсирование куков
app.use(cookieParser());

// Подключение логгеров
app.use(requestLogger);

// прохождение CORS защиты
app.use((req, res, next) => {
  const { method } = req;
  const { origin } = req.headers;
  const requestHeaders = req.headers['access-control-request-headers'];
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Headers', requestHeaders);
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    return res.end();
  }

  return next();
});

// если работа сервера упадет, то он восстановится
app.get('/crash-test', () => {
  setTimeout(() => {
    console.log('Сервер сейчас упадёт');
    throw new SERVER_ERROR('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string()
      .min(2)
      .max(30),
    about: Joi.string()
      .min(2)
      .max(30),
    avatar: Joi.string()
      .min(2)
      .max(30)
      .pattern(RegExpUrl),
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required(),
  }),
}), createUser);
app.get('/logout', logOut);

app.use(auth);
app.use('/users', users);
app.use('/cards', cards);

// Обработка несуществующей страницы
app.use((req, res, next) => {
  next(new NotFoundError(NOT_FOUND_PAGE));
});

// Подключение логгера ошибок
app.use(errorLogger);

// Обработка ошибок модуля 'Joi'
app.use(errors());

// Центральный обработчик ошибок
app.use((err, req, res, next) => {
  const { statusCode = SERVER_ERROR, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === SERVER_ERROR
        ? INTERNAL_SERVER_ERROR_MESSAGE
        : message,
    });

  return next();
});

module.exports = app;
