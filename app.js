const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb', {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
  })
  .then(() => {
    console.log('Подключено к mestodb');
  })
  .catch((err) => {
    console.log(`Ошибка++: ${err.message}`);
  });

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
