const mongoUtil = require('./mongoUtil')
let database = mongoUtil.getDoctorDb()
const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport')

passport.use(new LocalStrategy((username, password, done)=>{
  database.collection('user').findOne({username:username},(err,user)=>{
    if (err) { return done(err); }
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    if (user.password != password) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
  })
}));
// passport.serializeUser(database.collection('user').serializeUser());
// passport.deserializeUser(database.collection('user').deserializeUser());

module.exports.pp = function() {
  return passport;
}