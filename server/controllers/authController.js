const bcrypt = require('bcryptjs');

module.exports = {
    register: async (req,res) => {
        const db = req.app.get('db')
        const {isAdmin, username, password} = req.body
        const foundUser = await db.get_user(username)
        if(foundUser[0]){return res.status(409).send('username or password was incorrect')}
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password,salt)
        const registeredUser = await db.register_user(isAdmin,username,hash)
        delete registeredUser[0].hash
        req.session.user = registeredUser[0]
        res.status(201).send(req.session.user)
    },
    login: async(req,res) => {
        const db = req.app.get('db')
        const {username, password} = req.body
        const user = await db.get_user(username)
        if(!user[0]){return res.status(401).send('well thats an issue')}
        const isAuthenticated = bcrypt.compareSync(password,user[0].hash)
        if(isAuthenticated){
            delete user[0].hash
            req.session.user = user[0]
            return res.status(200).send(req.session.user)
        }
        return res.status(403).send('yeah thats a pass issue')
    },
    logout: async (req,res) => {
        req.session.destroy()
        res.sendStatus(200)
    }
}