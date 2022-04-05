const db = require('../../config/db')

function votingController(){
    return{
        voting(req, res){

            if(!req.isAuthenticated()){
                return res.redirect('/login')
            }
            
            if(req.user.isVoted == 'true'){
                return res.redirect('/result')
            }

            db.query(`select * from voters where role='admin'`, (err, result)=>{
                if(err){
                    console.log(err);
                }
                const object = JSON.parse(JSON.stringify(result))
                const admin = object[0]
                if(admin.semester == '20'){
                    db.query(`select * from candidates where isAccepted='true' order by count desc`, (err, result)=>{
                        if(err){
                            console.log(err);
                        }
                        const candidates = JSON.parse(JSON.stringify(result))
                        req.flash('declared', 'Result Declared')
                        return res.render('result', {
                            winners : candidates
                        })
                    })
                }else{
                    db.query(`select * from candidates where isAccepted='true'`, (err, result)=>{
                        if(err){
                            console.log(err);
                        }
                        const candidates = JSON.parse(JSON.stringify(result))
                        req.flash('notDeclared', 'Result Not Declared')
                        return res.render('voting', {
                            candidates : candidates
                        })
                    })
                }
            })
        },
        voted(req, res){
            const uid = req.params.uid

            // Change user status isVoted to true
            db.query(`select * from candidates where email='${req.user.email}'`, (err, result)=>{
                if(err){
                    return console.log(err);
                }
                if(result.length > 0){
                    db.query(`update candidates set isVoted='true' where email='${req.user.email}'`, (err, result)=>{
                        if(err){
                            console.log(err);
                        }
                        console.log('candidate updated');
                    })
                }else{
                    db.query(`update voters set isVoted='true' where email='${req.user.email}'`, (err, result)=>{
                        if(err){
                            console.log(err);
                        }
                        console.log('voter updated');
                    }) 
                }
            })

            if(req.user.role == 'admin'){
                db.query(`update candidates set count=count+30 where uid='${uid}'`, (err, result)=>{
                    if(err){
                        console.log(err);
                    }
                    return res.redirect('/result')
                })
            }else{
                db.query(`update candidates set count=count+10 where uid='${uid}'`, (err, result)=>{
                    if(err){
                        console.log(err);
                    }
                    return res.redirect('/result')
                })
            }
        },
        result(req, res){
            
            if(!req.isAuthenticated()){
                return res.redirect('/login')
            }
            if(req.user.isVoted == 'false'){
                return res.redirect('/voting')
            }

            db.query(`select * from voters where role='admin'`, (err, result)=>{
                if(err){
                    console.log(err);
                }
                const object = JSON.parse(JSON.stringify(result))
                const admin = object[0]
                if(admin.semester == '20'){
                    db.query(`select * from candidates where isAccepted='true' order by count desc`, (err, result)=>{
                        if(err){
                            console.log(err);
                        }
                        const candidates = JSON.parse(JSON.stringify(result))
                        req.flash('declared', 'Result Declared')
                        return res.render('result', {
                            winners : candidates
                        })
                    })
                }else{
                    db.query(`select * from candidates where isAccepted='true' order by count desc`, (err, result)=>{
                        if(err){
                            console.log(err);
                        }
                        const candidates = JSON.parse(JSON.stringify(result))
                        req.flash('notDeclared', 'Result Not Declared')
                        // return res.render('result', {
                        //     candidates : candidates
                        // })
                        db.query(`select * from candidates where isVoted='true'`, (err, result)=>{
                            if(err){
                                console.log(err);
                            }
                            const candiVoters = result.length
                            db.query(`select * from voters where isVoted='true'`,(err, result)=>{
                                if(err){
                                    console.log(err);
                                }
                                const voterVoters = result.length
                                const totalVoters = candiVoters + voterVoters
                                return res.render('result', {
                                    candidates : candidates,
                                    totalVoters : totalVoters
                                })
                            })
                        })
                    })
                }
            })
        },
        statistic(req, res){
            
            if(!req.isAuthenticated()){
                return res.redirect('/login')
            }
            if(req.user.isVoted == 'false'){
                return res.redirect('/voting')
            }

            db.query(`select name,count from candidates where isAccepted='true' order by count desc`, (err, result)=>{
                if(err){
                    console.log(err);
                }
                const candidates = JSON.parse(JSON.stringify(result))
                db.query(`select * from candidates where isVoted='true'`, (err, result)=>{
                    if(err){
                        console.log(err);
                    }
                    const candiVoters = result.length
                    db.query(`select * from voters where isVoted='true'`,(err, result)=>{
                        if(err){
                            console.log(err);
                        }
                        const voterVoters = result.length
                        const totalVoters = candiVoters + voterVoters
                        return res.render('statistic', {
                            candidates : candidates,
                            totalVoters : totalVoters
                        })
                    })
                })
                
            })
        },
        declared(req, res){
            const role = req.user.role
            db.query(`update voters set semester='20' where role='${role}'`, (err, result)=>{
                if(err){
                    console.log(err);
                }
                return res.redirect('/result')
            })
        }
    }
}

module.exports = votingController