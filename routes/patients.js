const express = require('express')
const mongoUtil = require('../mongoUtil')
const jwt = require('jsonwebtoken');

let doctorDb = mongoUtil.getDoctorDb()
let patientDb = mongoUtil.getPatientDb()

const passport = require('passport')

let auth = require('../auth')

const router = express.Router()

router.get('/', (req, res) => {
    res.send('Hello World')
})

router.get('/:username/', auth.required, (req, res) => {
    const { payload: { username } } = req;

    return patientDb.collection('user').find({username:username}).toArray()
      .then((userLog) => {
        if(!userLog) {
          return res.sendStatus(400);
        }
        let logArray = []
        userLog.forEach(element => {
          console.log(element)
          logArray.push(element)
        });
  
        return res.json(logArray);
      });
})


router.get('/:username/week/:week', auth.required, (req, res) => {
  const { username,week } = req.params;

  return db.collection('uv_log').find({username:username,week:Number(week)}).toArray()
    .then((userLog) => {
      if(!userLog) {
        return res.sendStatus(400);
      }

      return res.json(userLog);
    });
})

router.post('/treatment/save', auth.required, (req, res, next) => {
  if(!("username" in req.body)){
    return res.status(400).json({
      errors: {
        username: 'not found',
      }
    })
  }
  else if(!("uv" in req.body)){
    return res.status(400).json({
      errors: {
        uv: 'not found',
      }
    })
  }
  else if(!("date" in req.body)){
    return res.status(400).json({
      errors: {
        date: 'not found',
      }
    })
  }
  else if(!("week" in req.body)){
    return res.status(400).json({
      errors: {
        week: 'not found',
      }
    })
  }
  else{
    db.collection('uv_log').update({date:req.body.date},req.body,{upsert:true}).then(()=>{
      return res.status(201).json({save:"success"})
    })
  }
})

module.exports = router