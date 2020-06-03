`use strict`;

const dotenv = require('dotenv');
const MongoClient = require('mongodb').MongoClient;

// ENV configuration
dotenv.config({
  path: './config.env'
});

let doctor_database
let patient_database 

connection = (callback) => {
  const uri = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);
  const client = new MongoClient(uri, { keepAlive: 1,useUnifiedTopology: true,useNewUrlParser: true });
  client.connect((err,client) => {
    if (err){
      console.log("Database Connection Error")
    }
    else{
      console.log("Successful connect to database")
      // perform actions on the collection object
      doctor_database = client.db('doctor')
      patient_database = client.db('patient')
    }
    // return callback(err)
  })     
}

module.exports.connectToServer = connection
module.exports.getDoctorDb = ()=>{return doctor_database}
module.exports.getPatientDb = ()=>{return patient_database}
