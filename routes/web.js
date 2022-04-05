const homeController = require('../app/http/controllers/homeControllers')
const authCandidate = require('../app/http/controllers/authControllers/candidate')
const authVoters = require('../app/http/controllers/authControllers/voters')
const authLogin = require('../app/http/controllers/authControllers/login')
const candiProfile = require('../app/http/controllers/CandiControllers/candiProfile')
const adminController = require('../app/http/controllers/adminControllers/admin')
const votingController = require('../app/http/controllers/votingController')
const emailVerification = require('../app/http/controllers/emailVerification')

function initRoutes(app){

    // Home Routes
    app.get('/', homeController().index)
    app.get('/about', homeController().about)
    app.get('/contact', homeController().contact)

    // Login Logout
    app.get('/login', authLogin().login)
    app.post('/login', authLogin().postLogin)
    app.post('/logout', authLogin().logout)

    //candidate
    app.get('/registerCandidate', authCandidate().register)
    app.post('/registerCandidate', authCandidate().postRegister)
    app.get('/profile/:uid', candiProfile().profile)
    app.post('/profilePic/:uid', candiProfile().profilePic)

    //Voters
    app.get('/registerVoter', authVoters().register)
    app.post('/registerVoter', authVoters().postRegister)

    // Admin
    app.get('/admin', adminController().admin)
    app.get('/accept/:uid', adminController().accept)
    app.get('/deny/:uid', adminController().deny)

    // voting
    app.get('/voting', votingController().voting)
    app.get('/voted/:uid', votingController().voted)
    app.get('/result', votingController().result)
    app.get('/statistic', votingController().statistic)
    app.get('/declared', votingController().declared)

    // Verification
    app.post('/verifyEmail', emailVerification().verifyEmail)
}

module.exports = initRoutes