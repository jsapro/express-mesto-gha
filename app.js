const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { constants } = require('http2');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

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

// помогает защитить приложение от веб-уязвимостей путем соответствующей настройки заголовков HTTP
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to all requests
app.use(limiter);
app.use(express.json()); // вместо bodyParser
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// временное решение, добавляет в каждый запрос объект user (захардкодили _id)
// app.use((req, res, next) => {
//   // console.log(req.body, 555555555555);
//   req.user = {
//     _id: '6491ee441b433eb98ee93579',
//   };

//   next();
// });

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);

app.use('*', (req, res) => {
  res
    .status(constants.HTTP_STATUS_NOT_FOUND)
    .send({ message: 'Такой страницы не существует' });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту: ${PORT}`);
});
