module.exports = {
    usersOnly: (req,res,next) => {
        if(!req.session.user){
            res.status(401).send('bruh you gotta log first')
        }
        next();
    },
    adminsOnly: (req, res, next) => {
        if (!req.session.user.isAdmin) {
          return res.status(403).send('You are not an admin');
        }
        next();
    }
}