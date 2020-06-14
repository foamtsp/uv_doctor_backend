const express = require('express')
const mongoUtil = require('../mongoUtil')
const jwt = require('jsonwebtoken');

let patientDb = mongoUtil.getPatientDb()

const passport = require('passport')

let auth = require('../auth')

const router = express.Router()

router.get('/', (req, res) => {
    res.send('Hello World')
})

router.get('/login', auth.required, (req, res, next) => {
  let token = null;
  const { headers: { authorization } } = req;
  if(authorization && authorization.split(' ')[0] === 'Token') {
    token =  authorization.split(' ')[1];
    var user = jwt.verify(token, 'secret');

    return res.status(200).json({ 
      user: {
        _id: user.id,
        username: user.username,
        patients: user.patients,
      }});
  }
  else {
    return res.status(400).json({ 
      user: {
        status: 'pls login first'
      }});
  }
})

//Case login
router.post('/login', auth.optional, (req, res, next) => {
    const user = req.body
    if(!user.username) {
        return res.status(422).json({
          errors: {
            username: 'is required',
          },
        });
      }
    
    if(!user.password) {
        return res.status(422).json({
          errors: {
            password: 'is required',
          },
        });
    }
    
    return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
        if(err) {
            return next(err);
        }
        if(passportUser) {
            let user = passportUser;
            today = new Date();
            const expirationDate = new Date(today);
            expirationDate.setDate(today.getDate() + 60);
            let token = jwt.sign({
                username: user.username,
                id: user._id,
                exp: parseInt(expirationDate.getTime() / 1000, 10),
              }, 'secret')

            return res.json({ 
              user: {
                _id: user._id,
                username: user.username,
                patients: user.patients,
                token: token,
              }});
        }

        return res.status(400).json({
          errors: {
            user: 'not found',
          },
      });
    })(req, res, next);
})


//Case getallpatients
router.get('/:_id/getpatients', auth.required, (req, res, next) => {
    const doctor = req.params;
    // console.log(patientDb.collection('user'))
    

    patientDb.collection('user').find({doctor:doctor._id}).toArray()
    .then((patients) => {
      if(!patients) {
        return res.sendStatus(400);
      }
      let patientArray = []
      patients.forEach(patient => {
        patientArray.push(patient)
      });
      // console.log(patientArray)


      return res.json(patientArray);
    });

    
})

module.exports = router