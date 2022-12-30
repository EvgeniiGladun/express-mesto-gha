const User = require('../models/user');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((newUser) => res.status(200).send(newUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }

      return res.status(500).send({ message: 'Произошла неизвестная ошибка, проверьте корректность запроса' });
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
        return res.status(404).send({ message: err.message });
      }

      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при поиске пользователя.' });
      }

      return res.status(500).send({ message: 'Произошла неизвестная ошибка, проверьте корректность запроса' });
    });
};

const readUsers = (req, res) => {
  User.find({})
    .orFail(() => {
      const error = new Error('Ни одного пользователя, не нашлось');
      error.name = 'NotFound';
      throw error;
    })
    .then((usersStack) => res.send(usersStack))
    .catch((err) => {
      if (err.name === 'NotFound') {
        return res.status(404).send({ message: err.message });
      }

      return res.status(500).send({ message: 'Произошла неизвестная ошибка, проверьте корректность запроса' });
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
        return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      }

      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }

      if (err.name === 'NotFound') {
        return res.status(404).send({ message: err.message });
      }

      return res.status(500).send({ message: 'Произошла неизвестная ошибка, проверьте корректность запроса' });
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
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      }

      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      }

      if (err.name === 'NotFound') {
        return res.status(404).send({ message: err.message });
      }

      return res.status(500).send({ message: 'Произошла неизвестная ошибка, проверьте корректность запроса' });
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
