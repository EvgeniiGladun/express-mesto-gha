const users = require('express').Router();
const {
  readUser,
  readUsers,
  readMeProfile,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

users.get('/', readUsers);
users.get('/me', readMeProfile);
users.get('/:userId', readUser);

users.patch('/me', updateProfile);
users.patch('/me/avatar', updateAvatar);

// Экспортируем "роутер"
module.exports = users;
