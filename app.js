require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { Joi, celebrate, errors } = require('celebrate');

const users = require('./routes/users');
const cards = require('./routes/cards');

const { PORT = 3000 } = process.env;
const {
  NOT_FOUND_PAGE,
  SERVER_ERROR,
  INTERNAL_SERVER_ERROR_MESSAGE,
} = require('./constants');
const { auth } = require('./middlewares/auth');

const { login, createUser } = require('./controllers/users');
const NotFoundError = require('./errors/NotFoundError');

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Парсирование куков
app.use(cookieParser());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).default('Жак-Ив Кусто'),
    about: Joi.string().min(2).max(30).default('Исследователь'),
    avatar: Joi.string().min(2).max(30).default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required(),
  }),
}), createUser);

app.use(auth);
app.use('/users', users);
app.use('/cards', cards);

// Обработка ошибок модуля 'Joi'
app.use(errors());

// Обработка несуществующей страницы
app.use((req, res, next) => {
  next(new NotFoundError(NOT_FOUND_PAGE));
});

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

  next();
});

app.listen(PORT, () => {
  console.log('Сервак работает');
});
