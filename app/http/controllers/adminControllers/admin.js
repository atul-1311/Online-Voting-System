const db = require('../../../config/db')

function adminController(){
    return{
        admin(req, res){

            if(!req.isAuthenticated()){
                return res.redirect('/login')
            }

            if(req.user.role == 'admin'){
                db.query("select * from candidates", (err, result)=>{
                    if(err){
                        console.log(err);
                    }
                    const objects = JSON.parse(JSON.stringify(result))
                    return res.render('admin', {
                        candidates : objects
                    })
                })
            }
            
        },
        accept(req, res){
            const uid = req.params.uid;
            db.query(`update candidates set isAccepted='true' where uid='${uid}'`, (err, result)=>{
                if(err){
                    console.log(err);
                }
                return res.redirect('/admin')
            })
        },
        deny(req, res){
            const uid = req.params.uid;
            db.query(`delete from candidates where uid='${uid}'`,(err, result)=>{
                if(err){
                    console.log(err);
                }
                console.log("You have been diqualified from the election.")
                return res.redirect('/admin')
            })
        }
    }
}

module.exports = adminController