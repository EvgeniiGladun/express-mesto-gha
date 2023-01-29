const RegExp = /https?:\W+/;
const users = require('express').Router();
const { Joi, celebrate, errors } = require('celebrate');

const {
  readUser,
  readUsers,
  readMeProfile,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

users.get('/', readUsers);
users.get('/me', readMeProfile);
users.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
}), readUser);

users.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);
users.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(RegExp),
  }),
}), updateAvatar);

// Обработка ошибок модуля 'Joi'
users.use(errors());

// Экспортируем "роутер"
module.exports = users;
