const express = require('express')
const mongoUtil = require('../mongoUtil')
const generator = require('generate-password');
const crypto = require("crypto-js")
 

let doctorDb = mongoUtil.getDoctorDb()
let patientDb = mongoUtil.getPatientDb()

let auth = require('../auth')

const router = express.Router()

const skinMaxEUVMapping = {1:10 , 2:30 , 3:50 , 4:70 , 5:90, 6:100};

//Case add new patient
router.post('/addpatient', auth.required, (req, res, next) => {
  
  
  if(!("doctor" in req.body)){
    return res.status(400).json({
      errors: {
        doctor: 'not found',
      }
    })
  }
  else if(!("firstname" in req.body)){
    return res.status(400).json({
      errors: {
        firstname: 'not found',
      }
    })
  }
  else if(req.body.firstname.length <= 50){
    return res.status(400).json({
      errors: {
        firstname: 'Firstname is too long',
      }
    })
  }
  else if(!("lastname" in req.body)){
    return res.status(400).json({
      errors: {
        lastname: 'not found',
      }
    })
  }
  else if(req.body.lastname.length <= 50){
    return res.status(400).json({
      errors: {
        lasttname: 'Lastname is too long',
      }
    })
  }
  else if(!("birthDate" in req.body)){
    return res.status(400).json({
      errors: {
        birthDate: 'not found',
      }
    })
  }
  else if(new Date(req.body.birthDate) > new Date()){
    return res.status(400).json({
      errors: {
        birthDate: 'Birthdate should be in the past',
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
  else if(!(req.body.skin >= 1 && req.body.skin <= 6)){
    return res.status(400).json({
      errors: {
        skin: 'skin type is not correct',
      }
    })
  }
  else{


    let username = generator.generate({
      length: 10,
      numbers: true
    });

    let password = generator.generate({
      length: 12,
      numbers: true
    });

    const newPatient = {
      "username": username,
      "password": password,
      "firstname": req.body.firstname,
      "lastname": req.body.lastname,
      "birthDate": new Date(req.body.birthDate),
      "startDate": new Date(req.body.startDate),
      "skin": parseInt(req.body.skin),
      "maxEUV": skinMaxEUVMapping[parseInt(req.body.skin)]
    }

    patientDb.collection('user').insertOne(newPatient)
    .then((value)=>{
      doctorDb.collection('user').updateOne({username : req.body.doctor},{$push : {patients : value.insertedId}})
    })
    .then(()=>{

      let newUser = {
        'username': username,
        'password' : password
      }

      let encryptUser = CryptoJS.AES.encrypt(JSON.stringify(newUser), process.env.SECRET_KEY).toString();
      
      // // DECRYPT USER CODE
      // var bytes  = CryptoJS.AES.decrypt(encryptUser, process.env.SECRET_KEY);
      // var user = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      return res.status(201).json({
        create:"success",
        encryptUser: encryptUser
      })
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
  else if(!(req.body.skin >= 1 && req.body.skin <= 6)){
    return res.status(400).json({
      errors: {
        skin: 'skin type is not correct',
      }
    })
  }
  else{

    const update = {
      "startDate": new Date(req.body.startDate),
      "skin": parseInt(req.body.skin),
      "maxEUV": skinMaxEUVMapping[parseInt(req.body.skin)]
    }

    patientDb.collection('user').updateOne({username : req.body.username},{$set : update},{upsert:false})
    .catch(error => {
      return res.status(203).json({save:"failed"})
    })
    .then(()=>{
      return res.status(201).json({save:"success"})
    })
  }
})

module.exports = router