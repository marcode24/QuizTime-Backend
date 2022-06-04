const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
  
app.use('/api/quiz', require('./routes/quiz'));

module.exports = app;