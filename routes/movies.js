const router = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

const {
  parameterIdValid,
  createMovieValid,
} = require('../middlewares/validationJoi');

router.get('/', auth, getMovies);
router.post('/', auth, createMovieValid, createMovie);
router.delete('/:_id', auth, parameterIdValid('_id'), deleteMovie);

module.exports = router;
