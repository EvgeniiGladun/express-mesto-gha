const users = require('express').Router();
const {
  createUser,
  readUser,
  readUsers,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

users.get('/:userId', readUser);
users.get('/', readUsers);

users.post('/', createUser);

users.patch('/me', updateProfile);
users.patch('/me/avatar', updateAvatar);

// Экспортируем "роутер"
module.exports = users;
