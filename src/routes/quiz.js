const { Router } = require('express');
const { createQuiz, getQuiz, getQuizzes, answerQuiz } = require('../controllers/quiz');

const router = Router();

router.get('/', getQuiz);
router.get('/all', getQuizzes);

router.post('/', createQuiz);

router.put('/answer/:idQuiz', answerQuiz);

module.exports = router;