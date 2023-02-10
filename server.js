const app = require('./app');

const { PORT = 3500 } = process.env;

app.listen(PORT, () => {
  console.log('Сервак работает');
});
