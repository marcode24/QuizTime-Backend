const { Router } = require('express');
const { createQuiz, getQuiz, getQuizzes } = require('../controllers/quiz');

const router = Router();

router.get('/', getQuiz);
router.get('/all', getQuizzes);

router.post('/', createQuiz);

module.exports = router;