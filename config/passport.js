const LocalStrategy = require('passport-local');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/users');

module.exports = function(passport){
    passport.use(
        new LocalStrategy({ usernameField : 'email' }, (email, password, done) => {
            // Match the User
            User.findOne({ email })
                .then(user => {
                    if(!user){
                        return done(null, false, { message : 'Either email or password is incorrect.' });
                    }

                    // Match Password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if(err) throw err;

                        if(isMatch){
                            return done(null, user);
                        }else{
                            return done(null, false, { message : 'Either email or password is wrong.'});
                        }
                    });
                })
                .catch(err => console.error )
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user)=>{
            done(null, user);
        });
    });
}
