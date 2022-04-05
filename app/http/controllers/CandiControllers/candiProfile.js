const db = require('../../../config/db')
const multer = require('multer')
const path = require('path')

let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/profilePic/'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.
            originalname)}`;

            cb(null, uniqueName);
    }
})
let upload = multer({
    storage: storage,
    limit: { fileSize: 1000000},
}).single('file');


function candiProfile(){
    return{
        profile(req, res){
            const uid = req.params.uid;
            if(!req.isAuthenticated()){
                return res.redirect('/login')
            }

            db.query(`select * from candidates where uid='${uid}'`, (err, result)=>{
                if(err){
                    console.log(err)
                }
                if(result.length > 0){
                    if(req.user.role == 'candidate' || req.user.role == 'admin'){
                        if(req.user.uid == uid || req.user.role == 'admin'){
                            const object = JSON.parse(JSON.stringify(result));
                            const candidate = object[0];
                            req.flash('samecandi', 'Same Candidate')
                            return res.render('candidate/candiProfile', {
                            candidate : candidate
                            })
                        }else{
                            req.flash('randomuser', 'some random user')
                            return res.render('error')
                        }
                    }else{
                        req.flash('randomuser', 'some random user')
                        return res.render('error')
                    }
                }else{
                    req.flash('randomuser', 'some random user')
                    return res.render('error')
                }
            })
            
        },
        profilePic(req, res){

            upload(req, res, async (err) => {

                //validate request
                
                // if(!req.file){
                //     req.flash('picerror', '**File not choosen')
                //     console.log(req.file)
                //     return res.redirect(`/people/profile/edit/${ req.user.peopleId }`)
                // }

                if(err) {
                    console.log(err);
                    return res.redirect(`/profile/${ req.user.uid }`)
                }
        
            //database store
            const filePath = req.file.filename;
            db.query(`update candidates set profilePic='${filePath}' where uid='${req.user.uid}'`,(err, result)=>{
                if(err){
                    console.log(err);
                }
            })

            req.flash('picerror', 'Picture Updated')
            return res.redirect(`/profile/${ req.user.uid }`)
        })
        
        }    
    }
}

module.exports = candiProfile