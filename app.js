const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
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
// записываем _id карточки которую нужно удалить
app.use((req, res, next) => {
  req.user = {
    _id: '6491ee441b433eb98ee93579',
  };

  next();
});

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса
app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);

app.use('/*', (req, res) => {
  res.status(500).send({ message: 'Такой страницы не существует' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
