const db = require('../../../config/db')
const passport = require('passport')
const bcrypt = require('bcrypt')

function authLogin(){
    return{
        login(req, res){
            res.render('auth/login')
        },
        postLogin(req, res, next) {
            
            passport.authenticate('local', (err, user, info) => {          //return done(null, people, { message: "Logged in successfully !" })
                if(err){
                    req.flash('loginerror', info.message)
                    return next(err)
                }
                if(!user){
                    req.flash('loginerror', info.message)
                    return res.redirect('/login')
                }
                req.logIn(user, (err) => {
                    if(err){
                        req.flash('error', info.message)
                        return next(err)
                    }
                   if(user.role == 'voter'){
                       return res.redirect('/voting')
                   }else if(user.role == 'candidate'){
                       return res.redirect(`/profile/${user.uid}`)
                   }else{
                       return res.redirect('/admin')
                   }
                })
            })(req, res, next)
            
        },
        logout(req, res){
            req.logout();
            return res.redirect('/')
        }
    }
}

module.exports = authLogin