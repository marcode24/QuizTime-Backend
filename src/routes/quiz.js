const { Router } = require('express');
const { createQuiz } = require('../controllers/quiz');

const router = Router();

router.post('/', createQuiz);

module.exports = router;