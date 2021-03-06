const passport = require('passport');

const User = require('../models/user');

const config = require('../config');

const JwtStrategy = require('passport-jwt').Strategy;


const ExtractJwt = require('passport-jwt').ExtractJwt;

const LocalStrategy = require('passport-local');




const localOptions = { usernameField: 'email'};
const localLogin = new LocalStrategy(localOptions, (email, password, done)=>{
  User.findUserByCredentials(email, password).then((user)=>{
    done(null, user);
  }).catch((err)=>{
    done(err, false);
  })
});


const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done)=>{
 const id = payload.sub;

 User.findById(id).then((user)=>{
   if(!user){
    done(null, false);
   }
    done(null, user)
 }).catch((err)=>{
    done(err, false);
 });
});


passport.use(jwtLogin);
passport.use(localLogin);