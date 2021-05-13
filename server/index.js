require('dotenv').config()
const express = require('express');
const session = require('express-session')
const massive = require('massive')
const bcrypt = require('bcryptjs')
const authCtrl = require('./controllers/authController')
const treasureCtrl = require('./controllers/treasureController')
const auth = require('./middleware/authMiddleware')



const app = express()

let {SESSION_SECRET, CONNECTION_STRING} = process.env

let PORT = 4000

app.use(express.json())

app.use(
    session({
        secret: SESSION_SECRET,
        resave: true,
        saveUninitialized: false
    })
)

massive({
    connectionString: CONNECTION_STRING,
    ssl: {rejectUnauthorized: false}
}).then (db => {
    console.log('database is connected i guess')
    app.set('db', db)
});

app.listen(PORT, () => {
    console.log('Its not really a 3080')
})

app.post('/auth/register', authCtrl.register )
app.post('/auth/login', authCtrl.login)
app.get('/auth/logout' , authCtrl.logout)

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure)
app.get('/api/treasure/user' , auth.usersOnly, treasureCtrl.getUserTreasure)
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure)
app.get('/api/treasure/all', auth.usersOnly,auth.adminsOnly, treasureCtrl.getAllTreasure);

