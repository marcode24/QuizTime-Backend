const { request, response } = require("express");
const { isValidMongoId } = require("../helpers/mongo");
const Quiz = require("../models/quiz");

const createQuiz = async (req = request, res = response) => {
  try {
    let { questions } = req.body;

    if (questions.lenght === 2) {
      return res.status(400).json({
        ok: false,
        msg: "Must provide more than 2 questions",
      });
    }

    const questionsWrong = {
      title: `Must provide more than 1 answer for this questions: `,
      wrong: [],
    };

    questions.forEach((item) => {
      const { answers, question } = item;
      if (answers.length < 2) questionsWrong.wrong.push(question);
    });

    if (questionsWrong.wrong.length > 0) {
      return res.status(400).json({
        ok: false,
        msg: questionsWrong,
      });
    }
    questions.forEach((item, index) => (item.noQuestion = index + 1));
    const newQuiz = new Quiz({ ...req.body });
    const quizCreated = await newQuiz.save();
    res.status(200).json({
      ok: true,
      id: quizCreated._id,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Talk to Admin",
    });
    console.log(error);
  }
};

const getQuiz = async (req = request, res = response) => {
  try {
    const idQuiz = req.query.id;
    if (!isValidMongoId(idQuiz)) {
      return res.status(400).json({
        ok: false,
        msg: "Provide a valid id",
      });
    }
    const quiz = await Quiz.findById(idQuiz);
    if (!quiz) {
      return res.status(404).json({
        ok: false,
        msg: "Quiz not found",
      });
    }
    res.status(200).json({
      ok: true,
      quiz,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Talk to Admin",
    });
    console.log(error);
  }
};

const getQuizzes = async (req = request, res = response) => {
  try {
    const { type, skip, limit } = req.query;
    const filter = type ? { typeQuiz: type } : {};
    const [quizTop, quizzes] = await Promise.all([
      Quiz.findOne({}, "statistics creator title typeQuiz", {
        skip: 0,
        limit: 1,
        sort: { statistics: -1 },
      }),
      Quiz.find(filter, "statistics creator title typeQuiz")
        .skip(skip)
        .limit(limit),
    ]);
    res.status(200).json({
      ok: true,
      quizTop,
      quizzes,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Talk to Admin",
    });
    console.log(error);
  }
};

const answerQuiz = async (req = request, res = response) => {
  try {
    const idQuiz = req.params.idQuiz;
    const answers = req.body.answers;
    if (!isValidMongoId(idQuiz)) {
      return res.status(400).json({
        ok: false,
        msg: "Provide a valid id",
      });
    }

    // lean(): get only properties 'pure'
    const [quiz, quizTemp] = await Promise.all([
      Quiz.findById(idQuiz, "statistics questions"),
      Quiz.findById(idQuiz, "questions -_id").lean(),
    ]);
    const { questions } = quizTemp;

    // verify which answers are right or wrong
    questions.map((el) => (el.status = "wrong"));
    answers.map((el) => (el.reviewed = false));
    let wrong = 0;
    questions.forEach((item, index) => {
      // use every to 'break' loop
      answers.every((ans, i) => {
        if (item.noQuestion === ans.noQuestion && !ans.reviewed) {
          item.correctAnswer === ans.answer
            ? (questions[index].status = "right")
            : wrong++;
          questions[index]["yourAnswer"] = ans.answer;
          answers[i].reviewed = true;
          return false;
        } else {
          return true;
        }
      });
    });

    // change statistics
    quiz.statistics.answered++;
    wrong > 0 ? quiz.statistics.wrong++ : quiz.statistics.right++;

    await quiz.save();
    res.status(200).json({
      ok: true,
      questions,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Talk to Admin",
    });
    console.log(error);
  }
};

module.exports = {
  createQuiz,
  getQuiz,
  getQuizzes,
  answerQuiz,
};
