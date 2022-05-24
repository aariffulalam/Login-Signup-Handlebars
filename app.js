// const { prisma } = require('@prisma/client');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient

const express = require('express');
const createError = require('http-errors');
const morgan = require('morgan');
require('dotenv').config();

const { verifyToken } = require('./middleware/auth.middleware')

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.set('view engine', 'hbs')

app.get('/', verifyToken, async (req, res, next) => {
  id = req.UserId
  console.log(id)
  const userData = await prisma.user.findUnique({
    where: {
      id
    }
  })
  console.log(userData.fname, userData.age)
  res.render('home', { 'fname': userData.fname, 'lname': userData.lname })
});

app.use('/auth', require('./routes/auth.route'));

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));