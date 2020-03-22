const express = require('express')
const mongoUtil = require('../mongoUtil')

let doctorDb = mongoUtil.getDoctorDb()
let patientDb = mongoUtil.getPatientDb()

let auth = require('../auth')

const router = express.Router()


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

router.post('/save', auth.required, (req, res, next) => {
  if(!("username" in req.body)){
    return res.status(400).json({
      errors: {
        username: 'not found',
      }
    })
  }
  else if(!("startDate" in req.body)){
    return res.status(400).json({
      errors: {
        startDate: 'not found',
      }
    })
  }
  else if(!("skin" in req.body)){
    return res.status(400).json({
      errors: {
        skin: 'not found',
      }
    })
  }
  else{

    const skinMaxEUVMapping = {1:10 , 2:30 , 3:50 , 4:70 , 5:90};

    const update = {
      "startDate": req.body.startDate,
      "skin": req.body.skin,
      "maxEUV": skinMaxEUVMapping[parseInt(req.body.skin)]
    }

    patientDb.collection('user').updateOne({username : req.body.username},{$set : update},{upsert:false})
    .then(()=>{
      return res.status(201).json({save:"success"})
    })
  }
})

module.exports = router