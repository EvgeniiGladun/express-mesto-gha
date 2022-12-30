const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const users = require('./routes/users');
const cards = require('./routes/cards');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: '63ae0c8691da725ae5edc6a3',
  };

  next();
});
app.use('/', users);
app.use('/', cards);

app.listen(PORT, () => {
  console.log('Сервак работает');
});
