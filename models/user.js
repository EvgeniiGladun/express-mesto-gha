const validator = require('validator');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { NOT_FOUND_USER } = require('../constants');
const Unauthorized = require('../errors/Unauthorized');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    validate(value) {
      return validator.isEmail(value);
    },
  },
  password: {
    type: String,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password, next) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new Unauthorized(NOT_FOUND_USER);
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new Unauthorized(NOT_FOUND_USER);
          }

          // Создание секретного ключа
          return user;
        });
    }).catch(next);
};

module.exports = mongoose.model('user', userSchema);
