const db = require('../../../config/db')
const bcrypt = require('bcrypt')
const emailVerification = require('../emailVerification')

function authcandidate(){
    return{
        register(req, res){
            res.render('auth/registerCandidate')
        },
        async postRegister(req, res){
            
            const { uid, name, email, password, father, mother, tenthMarks, tenthYear, twelveMarks, twelveYear, semcgpa, skills, reason } = req.body;

            // Check request data
            if(!uid || !name || !email || !password || !father || !mother || !tenthMarks || !tenthYear || !twelveMarks || !twelveYear || !semcgpa || !skills || !reason){
                req.flash("candierror", "**All fields are required")
                req.flash("uid", uid);
                req.flash("name", name);
                req.flash("email", email);
                req.flash("father", father);
                req.flash("mother", mother);
                return res.redirect('/registerCandidate')
            }

            // check if uid exists
            await db.query(`select * from candidates where uid='${ uid }'`, (err, result)=>{
                if(err){
                    req.flash('votererr', "**Something Went Wrong")
                    return res.redirect('/registerVoter')
                }
                if(result.length > 0){
                    req.flash('candierror', "**UID Already Exists")
                    req.flash("uid", uid);
                    req.flash("name", name);
                    req.flash("email", email);
                    req.flash("father", father);
                    req.flash("mother", mother);
                    return res.redirect('/registerCandidate')
                }
            })

            // check if email exists
            await db.query(`select * from candidates where email='${ email }'`, (err, result)=>{
                if(err){
                    req.flash('votererr', "**Something Went Wrong")
                    return res.redirect('/registerVoter')
                }
                if(result.length > 0){
                    req.flash('candierror', "**Email Already Exists")
                    req.flash("uid", uid);
                    req.flash("name", name);
                    req.flash("email", email);
                    req.flash("father", father);
                    req.flash("mother", mother);
                    return res.redirect('/registerCandidate')
                }
            })

             //Hash Password
             const hashedpassword = await bcrypt.hash(password, 10);
             const candiname = name.toUpperCase();

            // Register Candidate
            await db.query(`insert into candidates values('${uid}','${candiname}','${email}','${hashedpassword}','${father}', '${mother}', 
               '${tenthMarks}', '${tenthYear}', '${twelveMarks}', '${twelveYear}', '${semcgpa}', '${skills}', '${reason}','candidate', 'false', 'user-2.jpg', 'false', 100, 'false')`, (err, result)=>{
                if(err){
                    req.flash('votererr', "**Something Went Wrong")
                    return res.redirect('/registerCandidate')
                }
                emailVerification().genToken(email)
                return res.redirect('/login')
            })
        }
    }
}

module.exports = authcandidate