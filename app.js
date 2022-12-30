const express = require('express');
const mongoose = require('mongoose');

const users = require('./routes/users');
const cards = require('./routes/cards');

const { PORT = 3000 } = process.env;
const { NOT_FOUND } = require('./constants');

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: '63ae0c8691da725ae5edc6a3',
  };

  next();
});
app.use('/users', users);
app.use('/cards', cards);
app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: 'Страница по указанному маршруту не найдена' });
});

app.listen(PORT, () => {
  console.log('Сервак работает');
});
