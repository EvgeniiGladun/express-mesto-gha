const mongoose = require('mongoose');
const { RegExpUrl } = require('../constants');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    min: 2,
    max: 30,
    require: true,
  },
  link: {
    type: String,
    validate(link) {
      return RegExpUrl.test(link);
    },
    require: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('card', cardSchema);
