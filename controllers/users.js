const User = require('../models/user');
const {
  OK,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require('../constants');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((newUser) => res.status(OK).send(newUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }

      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла неизвестная ошибка, проверьте корректность запроса' });
    });
};

const readUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      const error = new Error(`Пользователь по указанному _id [${req.params.userId}] не найден.`);
      error.name = 'NotFound';
      throw error;
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'NotFound') {
        return res.status(NOT_FOUND).send({ message: err.message });
      }

      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при поиске пользователя.' });
      }

      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла неизвестная ошибка, проверьте корректность запроса' });
    });
};

const readUsers = (req, res) => {
  User.find({})
    .then((usersStack) => res.send(usersStack))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }

      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла неизвестная ошибка, проверьте корректность запроса' });
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      const error = new Error(`Пользователь по указанному _id [${req.user._id}] не найден.`);
      error.name = 'NotFound';
      throw error;
    })
    .then((updateUser) => res.send(updateUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки.' });
      }

      if (err.name === 'NotFound') {
        return res.status(NOT_FOUND).send({ message: err.message });
      }

      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла неизвестная ошибка, проверьте корректность запроса' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      const error = new Error(`Пользователь по указанному _id [${req.user._id}] не найден.`);
      error.name = 'NotFound';
      throw error;
    })
    .then((newAvatar) => res.send(newAvatar))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      }

      if (err.name === 'NotFound') {
        return res.status(NOT_FOUND).send({ message: err.message });
      }

      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла неизвестная ошибка, проверьте корректность запроса' });
    });
};

// Экспорируем функций
module.exports = {
  createUser,
  readUser,
  readUsers,
  updateProfile,
  updateAvatar,
};
