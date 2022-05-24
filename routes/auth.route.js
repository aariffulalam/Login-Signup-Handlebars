const router = require('express').Router();

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const bcrypt = require('bcrypt');
const e = require('express');

const { generateToken } = require('../middleware/auth.middleware')

router.get('/signup', async (req, res) => {
  res.render('signup')

});


router.post('/data', async (req, res) => {
  const { fname, lname, phoneNumber, email, password } = req.body

  try {
    const salt = await bcrypt.genSalt(8)
    const hashedPassword = await bcrypt.hash(password, salt)
    // //console.log(req.body)
    const user = await prisma.user.create({
      data: {
        fname,
        lname,
        phoneNumber,
        email,
        password: hashedPassword
      }
    })

    // //console.log(user)
    // res.send(user)
    res.redirect('/auth/login')

  } catch (error) {
    // res.send(error.massege)
    // //console.log(error.massege)
  }
})

router.get('/login', (req, res) => {
  res.render('login')
});

router.post('/account', async (req, res) => {
  const { email, password } = req.body
  //console.log(email)
  try {
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    })
    //console.log(user)
    const isPasswordMatched = await bcrypt.compare(password, user.password)
    if (isPasswordMatched) {
      const token = generateToken(user.id)
      //console.log(token)
      res.cookie('userToken', token)
      res.redirect('/')
    } else {
      res.status(500).json({ "status": error, "message": "user not exist" })
    }
  } catch (error) {
    res.status(500).json({ 'error': error })
  }
})


module.exports = router;
