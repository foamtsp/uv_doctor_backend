`use strict`;

const MongoClient = require('mongodb').MongoClient;

let doctor_database
let patient_databse 

connection = (callback) => {
  const uri = "mongodb+srv://whisper:ultraviolet64@cluster0-fdqs9.gcp.mongodb.net/test?retryWrites=true&w=majority";
  const client = new MongoClient(uri, { keepAlive: 1,useUnifiedTopology: true,useNewUrlParser: true });
  client.connect((err,client) => {
    console.log("Successful connect to database")
    // perform actions on the collection object
    doctor_database = client.db('doctor')
    patient_databse = client.db('patient')
    return callback(err)
  })     
}

module.exports.connectToServer = connection
module.exports.getDoctorDb = ()=>{return doctor_database}
module.exports.getPatientDb = ()=>{return patient_database}
