const otpGenerator = require('otp-generator')
const db = require('../../config/db')

function emailVerification(){
    return{
        async genToken(email){
            let token = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
            let otp = token.toString();

            // save token in database
            await db.query(`insert into emailtokens values('${otp}', '${email}')`, (err, result)=>{
                if(err){
                    console.log(err);
                }
                console.log('inserted token');
            })
            console.log(token);

        },
        verifyEmail(req, res){
            const {otp} = req.body;
            db.query(`select * from emailtokens where tokens='${otp}'`, (err, result)=>{
                if(err){
                    console.log(err);
                }
                if(result.length > 0){
                    const object = JSON.parse(JSON.stringify(result))
                    const email = object[0].email;
                    db.query(`update candidates set emailVerified='true' where email='${email}'`, (err, result)=>{
                        if(err){
                            console.log(err);
                        }
                        console.log('updated email');
                    })
                    return res.redirect(`/profile/${ req.user.uid }`)
                }else{
                    req.flash('otperror', '**Wrong OTP')
                    return res.redirect(`/profile/${ req.user.uid }`)
                }
            })
        }
    }
}

module.exports = emailVerification