const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path')
const mysql = require('mysql')
const PORT = process.env.PORT || 5000
const session = require('express-session')
const flash = require('express-flash')
const passport = require('passport')

// Database Connection
const connectDB = require('./app/config/db')

//session config
app.use(session({
    secret: "evoting",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 2 } //24hours age of cookie
}))

//passport config
const passportInit = require('./app/config/passport');
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash())

//Assets
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Global Middlrwares
app.use((req, res, next) => {
    res.locals.user = req.user;
    next()
})

// set template engine
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs')

// Routes
require('./routes/web')(app);

app.listen(PORT, ()=>{
    console.log(`Listening on port ${ PORT }`)
})