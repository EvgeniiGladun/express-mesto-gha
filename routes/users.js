const users = require('express').Router();
const {
  createUser,
  readUser,
  readUsers,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

users.get('/users/:userId', readUser);
users.get('/users', readUsers);

users.post('/users', createUser);

users.patch('/users/me', updateProfile);
users.patch('/users/me/avatar', updateAvatar);

// Экспортируем "роутер"
module.exports = users;
