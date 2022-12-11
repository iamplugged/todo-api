const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const validateToken = require('./middlewares/auth');
const authRouter = require('./routes/auth');
const todoRouter = require('./routes/todos');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/auth', authRouter);
app.use('/api/todos', validateToken, todoRouter);

module.exports = app;
