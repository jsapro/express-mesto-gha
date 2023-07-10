require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { MONGO_URL, PORT = 3000 } = require('./utils/config');
const router = require('./routes');
const { finalErrorHandler } = require('./middlewares/finalErrorHandler');

const app = express();

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    // useCreateIndex: true,  //not supported
    // useFindAndModify: false,   //not supported
  })
  .then(() => {
    console.log('Подключено к базе данных mestodb');
  })
  .catch((err) => {
    console.log(`Ошибка mongoose.connect: ${err.message}`);
  });

// помогает защитить приложение от веб-уязвимостей путем соответствующей настройки заголовков HTTP
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter); // Apply the rate limiting middleware to all requests
app.use(express.json()); // вместо bodyParser
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(router);

app.use(errors()); // обработчик ошибок celebrate
router.use(finalErrorHandler);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту: ${PORT}`);
});
