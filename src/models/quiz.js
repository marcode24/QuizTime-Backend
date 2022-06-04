const { Schema, model } = require("mongoose");

const quizSchema = new Schema({
  creator: {
    type: String,
    default: 'anonymous',
    required: false
  },
  title: {
    type: String,
    required: true,
  },
  questions: [{
    noQuestion: {
      type: Number,
      required: true
    },
    question: {
      type: String,
      required: true
    },
    answers: [{
      type: String,
      required: true,
    }],
    correctAnswer: {
      type: Number,
      required: true
    },
    _id: false
  }],
  typeQuiz: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: new Date(),
    required: true,
  },
  statistics: {
    answered: {
      type: Number,
      default: 0
    },
    right: {
      type: Number,
      default: 0,
    },
    wrong: {
      type: Number,
      default: 0
    },
  }
});

module.exports = model('Quiz', quizSchema);