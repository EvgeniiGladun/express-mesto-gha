const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const { JWT_SECRET } = require('../middlewares/auth');

const Conflict = require('../errors/Conflict');
const BadRequest = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFoundError');

const {
  OK,
  SUCCESSFUL_COOKIE,
  NOT_FOUND_USERID,
  BAD_REQUEST_CREATE_USER,
  BAD_REQUEST_UPDATE_AVATAR,
  BAD_REQUEST_SEARCH_USER,
  CONFLICT_EMAIL,
} = require('../constants');

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // Сверяем хеши с данными клиента и БД
      bcrypt.compare(password, user.password);

      // Создание секретного jwt-токена
      const token = jwt.sign({ _id: user.id }, JWT_SECRET, { expiresIn: '7d' });

      res.cookie('tokenValid', 'true');
      // Отправка кука пользователю с ключем
      return res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true }).send({
        message: SUCCESSFUL_COOKIE,
        JWT: token,
      });
    }).catch(next);
};

const logOut = (req, res, next) => {
  try {
    res.cookie('tokenValid', 'false');
    res.clearCookie('jwt').send({
      message: 'Вышли из аккаунта',
    });
  } catch (err) {
    next(err);
  }
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((passHash) => User.create({
      name,
      about,
      avatar,
      email,
      password: passHash,
    })
      .then((newUser) => res.status(OK).send({
        _id: newUser._id,
        name,
        about,
        avatar,
        email,
      })))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new Conflict(CONFLICT_EMAIL));
      }

      if (err.name === 'ValidationError') {
        return next(new BadRequest(BAD_REQUEST_CREATE_USER));
      }

      return next(err);
    });
};

const readUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFoundError(NOT_FOUND_USERID);
    })
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest(BAD_REQUEST_SEARCH_USER));
      }

      return next(err);
    });
};

const readUsers = (req, res, next) => {
  User.find({})
    .then((usersStack) => res.send(usersStack))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest(BAD_REQUEST_CREATE_USER));
      }

      return next(err);
    });
};

const readMeProfile = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw next(new NotFoundError(NOT_FOUND_USERID));
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'NotFound') {
        return next(new NotFoundError(NOT_FOUND_USERID));
      }

      if (err.name === 'CastError') {
        return next(new BadRequest(BAD_REQUEST_SEARCH_USER));
      }

      return next(err);
    });
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      throw next(new NotFoundError(NOT_FOUND_USERID));
    })
    .then((updateUser) => res.status(OK).send(updateUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest(BAD_REQUEST_CREATE_USER));
      }

      if (err.name === 'NotFound') {
        return next(new NotFoundError(NOT_FOUND_USERID));
      }

      return next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      throw next(new NotFoundError(NOT_FOUND_USERID));
    })
    .then((newAvatar) => res.status(OK).send(newAvatar))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest(BAD_REQUEST_UPDATE_AVATAR));
      }

      if (err.name === 'NotFound') {
        return next(new NotFoundError(NOT_FOUND_USERID));
      }

      return next(err);
    });
};

// Экспорируем функций
module.exports = {
  login,
  logOut,
  createUser,
  readUser,
  readUsers,
  readMeProfile,
  updateProfile,
  updateAvatar,
};
