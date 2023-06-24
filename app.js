const express = require('express');
const mongoose = require('mongoose');
const { constants } = require('http2');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb', {
    useNewUrlParser: true,
    // useCreateIndex: true,  //not supported
    // useFindAndModify: false,   //not supported
  })
  .then(() => {
    console.log('Подключено к mestodb');
  })
  .catch((err) => {
    console.log(`Ошибка: ${err.message}`);
  });

// временное решение, добавляет в каждый запрос объект user (захардкодили _id)
app.use((req, res, next) => {
  req.user = {
    _id: '6491ee441b433eb98ee93579',
  };

  next();
});

app.use(express.json()); // вместо bodyParser

app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);

app.use('*', (req, res) => {
  res
    .status(constants.HTTP_STATUS_NOT_FOUND)
    .send({ message: 'Такой страницы не существует' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
