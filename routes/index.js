const router = require('express').Router();
const userRoute = require('./users');
const movieRoute = require('./movies');
const ErrorNotFound = require('../errors/ErrorNotFound');

router.use('/users', userRoute);
router.use('/movies', movieRoute);

router.use((req, res, next) => {
  next(new ErrorNotFound({ message: 'Данный путь не найден' }));
});

module.exports = router;
