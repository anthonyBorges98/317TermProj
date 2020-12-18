var express = require('express');
var router = express.Router();
var db = require('../conf/database');
var bcrypt = require('bcrypt');

const UserError = require('../helpers/error/UserErrors');
const {
    successPrint,
    errorPrint
} = require('../helpers/debug/debugPrinters');


/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/register', (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
    let passConfirm = req.body.passConfirm

    /**
     * DO SERVER SIDE VALIDATION HERE
     */

    db.execute("SELECT * FROM users WHERE username=?", [username])
        .then(([results, fields]) => {
            if (results && results.length == 0) {
                return db.execute("SELECT * FROM users WHERE email=?;", [email]);
            } else {
                throw new UserError(
                    "Registration failed: Username already exists",
                    "/registration",
                    200
                );
            }
        })
        .then(([results, fields]) => {
            if (results && results.length == 0) {
                return bcrypt.hash(password, 15);
            } else {
                throw new UserError(
                    "Registration failed: Email already exists",
                    "/registration",
                    200
                );
            }
        })
        .then((hashedPassword) => {
            let baseSQL = "INSERT INTO users (username,email,password,created) VALUES(?,?,?,now());"
            return db.execute(baseSQL, [username, email, hashedPassword]);
        })
        .then(([results, fields]) => {
            if (results && results.affectedRows) {
                successPrint("users.js --> User was created!!");
                req.flash('success','User account has been made')
                res.redirect('/login');
            } else {
                throw new UserError(
                    "Server error, user could not be created",
                    "/registration",
                    500
                );
            }
        })
        .catch((err) => {
            errorPrint("User could not be made", err);
            if (err instanceof UserError) {
                errorPrint(err.getMessage());
                req.flash('error',err.getMessage());
                res.status(err.getStatus());
                res.redirect(err.getRedirectURL());
            } else {
                next(err);
            }
        });
});

router.post('/login', (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;
    /**
     * DO SERVER SIDE VALIDATION
     * NOT DONE IN VIDEO
     * DO ON OUR OWN
     */

    let baseSQL = "SELECT id, username, password FROM users WHERE username=?;"
    let userId;
    db.execute(baseSQL, [username])
        .then(([results, fields]) => {
            if (results && results.length == 1) {
                let hashedPassword = results[0].password;
                userId = results[0].id;
                return bcrypt.compare(password, hashedPassword);
            } else {
                throw new UserError("invalid username or password", "/login", 200);
            }
        })
        .then((passwordsMatched) => {
            if (passwordsMatched) {
                successPrint(`User ${username} is logged in`);
                req.session.username = username;
                req.session.id = userId;
                res.locals.logged = true;
                req.flash('success','you have been successfully logged in')
                res.redirect("/");

            } else {
                throw new UserError("Invalid username or password", "/login", 200);
            }
        })
        .catch((err) => {
            if (errorPrint(err instanceof UserError)) {
                errorPrint(err.getMessage());
                req.flash('error',err.getMessage());
                res.status(err.getStatus());
                res.redirect('/login');
            } else {
                next(err);
            }
        });
});
router.post('/logout',(req,res,next) =>{
   req.session.destroy((err) => {
       if(err){
           errorPrint("session could not be destroyed");
           next(err);
       }else{
           successPrint("Session was destroyed");
           res.clearCookie('csid');
           res.json({status:"OK", message: "user is logged out"});
       }
   })
});


module.exports = router;