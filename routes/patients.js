const express = require('express')
const mongoUtil = require('../mongoUtil')

let doctorDb = mongoUtil.getDoctorDb()
let patientDb = mongoUtil.getPatientDb()

let auth = require('../auth')

const router = express.Router()

const skinMaxEUVMapping = {1:10 , 2:30 , 3:50 , 4:70 , 5:90};

//Case add new patient
router.post('/addpatient',auth.required, (req, res, next) => {
  
  if(!("doctor" in req.body)){
    return res.status(400).json({
      errors: {
        doctor: 'not found',
      }
    })
  }
  else if(!("username" in req.body)){
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

    const update = {
      "doctor": req.body.doctor,
      "startDate": req.body.startDate,
      "skin": parseInt(req.body.skin),
      "maxEUV": skinMaxEUVMapping[parseInt(req.body.skin)]
    }

    patientDb.collection('user').updateOne({username : req.body.username},{$set : update},{upsert:false})
    .then(()=>{
      doctorDb.collection('user').updateOne({username : req.body.doctor},{$push : {patients : req.body.username}})
    })
    .then(()=>{
      return res.status(201).json({create:"success"})
    })
  }

})

//Case edit patient data
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

    const update = {
      "startDate": req.body.startDate,
      "skin": parseInt(req.body.skin),
      "maxEUV": skinMaxEUVMapping[parseInt(req.body.skin)]
    }

    patientDb.collection('user').updateOne({username : req.body.username},{$set : update},{upsert:false})
    .then(()=>{
      return res.status(201).json({save:"success"})
    })
  }
})

module.exports = router