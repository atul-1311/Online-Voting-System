const LocalStrategy = require('passport-local').Strategy
const db = require('../config/db');
const bcrypt = require('bcrypt');

function init(passport){
    passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, async (email, password, done) => {

        // Check email in candidate
        db.query(`select * from candidates where email='${email}'`, (err, result)=>{
            if(err){
                return done(null, false, { message: "**Something went wrong" })
            }
            if(result.length > 0){
                const user = result[0];
                bcrypt.compare(password, user.password).then(match => {
                    if(match){
                        return done(null, user, { message: "Logged in successfully !" })
                    }
                    return done(null, false,  { message: "**Wrong ID or Password" })
                }).catch(err => {
                    return done(null, false, { message: "**Something went wrong" })
                })
            }else{
                // check email in voters
               db.query(`select * from voters where email='${email}'`, (err, result)=>{
                    if(err){
                        return done(null, false, { message: "**Something went wrong" })
                    }
                    if(result.length > 0){
                        const user = result[0];
                        bcrypt.compare(password, user.password).then(match => {
                            if(match){
                                return done(null, user, { message: "Logged in successfully !" })
                            }
                            return done(null, false,  { message: "**Wrong ID or Password" })
                        }).catch(err => {
                            return done(null, false, { message: "**Something went wrong" })
                        })
                    }
                    if(result.length == 0){
                        return done(null, false, { message: "**Email ID doesn't exists" })
                    }
                })
            }
        })

        
    }))

    passport.serializeUser((user, done) => {
        done(null, user.email)
    })

    passport.deserializeUser((email, done) => {                            //this is to use "req.body" means current logged in user
        // People.findById(id, (err, people) =>{
        //     done(err, people)
        // })
        db.query(`select * from candidates where email='${email}'`, (err, result)=>{
            if(result.length>0){
                done(err, result[0])
            }else{
                db.query(`select * from voters where email='${email}'`, (err, result)=>{
                    done(err, result[0])
                })
            }
        })
    })
}

module.exports = init