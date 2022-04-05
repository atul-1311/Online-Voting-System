const db = require('../../../config/db')
const bcrypt = require('bcrypt')

function authvoter(){
    return{
        register(req, res){
            res.render('auth/registerVoters')
        },
        async postRegister(req, res){

            const { fname, lname, email, password, semester } = req.body;

            // Check request data
            if(!fname || !email || !password || !semester){
                req.flash("votererr", "**All fields are required")
                req.flash("fname", fname);
                req.flash("lname", lname);
                req.flash("email", email);
                req.flash("semester", semester)
                return res.redirect('/registerVoter')
            }

            // Check if e-mail exists
            await db.query(`select * from voters where email='${ email }'`, (err, result)=>{
                if(err){
                    req.flash('votererr', "**Something Went Wrong")
                    return res.redirect('/registerVoter')
                }
                if(result.length > 0){
                    req.flash('votererr', "**Email Already Exists")
                    req.flash("fname", fname);
                    req.flash("lname", lname);
                    req.flash("email", email);
                    req.flash("semester", semester)
                    return res.redirect('/registerVoter')
                }
            })

            //Hash Password
            const hashedpassword = await bcrypt.hash(password, 10);

            // Register voter
            await db.query(`insert into voters values('${fname}','${lname}','${email}','${hashedpassword}','${semester}','false', 'voter')`, (err, result)=>{
                if(err){
                    req.flash('votererr', "**Something Went Wrong")
                    return res.redirect('/registerVoter')
                }
                return res.redirect('/login')
            })
            
        }
    }
}

module.exports = authvoter