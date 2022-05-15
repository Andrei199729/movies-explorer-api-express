require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');

const { errors } = require('celebrate');

const { createUser, login } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { registerValid, loginValid } = require('./middlewares/validationJoi');
const limiter = require('./middlewares/rateLimit');
const errorHandler = require('./middlewares/errorHandler');

// Слушаем 3000 порт
const { PORT = 3000, NODE_ENV, BASE_URL } = process.env;

const routesErrorsWay = require('./routes/index');
const auth = require('./middlewares/auth');

const app = express();

app.use(cors(
  {
    origin: true,
  },
));

mongoose.connect(NODE_ENV === 'production' ? BASE_URL : 'mongodb://localhost:27017/moviesdb', { useNewUrlParser: true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger); // подключаем логгер запросов

app.use(helmet());
app.use(limiter);

app.post('/signup', registerValid, createUser);
app.post('/signin', loginValid, login);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(auth);

app.use('/', routesErrorsWay);

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
