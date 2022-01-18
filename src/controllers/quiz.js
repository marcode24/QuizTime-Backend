const { request, response } = require('express');
const Quiz = require('../models/quiz');

const createQuiz = async(req = request, res = response) => {
  try {
    let { questions } = req.body;

    if(questions.lenght === 2) {
      return res.status(400).json({
        ok: false,
        msg: 'Must provide more than 2 questions'
      });
    }

    const questionsWrong = {
      title: `Must provide more than 1 answer for this questions: `,
      wrong: [],
    };

    questions.forEach(item => {
      const { answers, question } = item;
      if(answers.length < 2) questionsWrong.wrong.push(question);
    });

    if(questionsWrong.wrong.length > 0) {
      return res.status(400).json({
        ok: false,
        msg: questionsWrong
      });
    }
    questions.forEach((item, index) => item.noQuestion = index + 1);
    const newQuiz = new Quiz({ ...req.body });
    const quizCreated = await newQuiz.save();
    res.status(200).json({
      ok: true,
      msg: 'Quiz created correctly',
      id: quizCreated._id
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Talk to Admin'
    })
    throw new Error(error);
  }
}

module.exports = {
  createQuiz,
};
