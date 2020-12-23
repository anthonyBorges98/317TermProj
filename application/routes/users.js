var express = require('express');
var router = express.Router();
const UserModel = require('../models/Users');
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
    UserModel.usernameExists(username)
        .then((userDoesNameExist) => {
            if(userDoesNameExist){
                throw new UserError(
                    "Registration failed: Username already exists",
                    "/registration",
                    200
                );
            }else{
                return UserModel.emailExists(email);
            }
        })
        .then((emailDoesExist) =>{
            if(emailDoesExist){
                throw new UserError(
                    "Registration failed: Email already exists",
                    "/registration",
                    200
                );
            }else{
                return UserModel.create(username,email,password);
            }
        })
        .then((createUserId) =>{
            if(createUserId < 0){
                throw new UserError(
                    "Server error, user could not be created",
                    "/registration",
                    500
                );
            }else{
                successPrint("users.js --> User was created!!");
                req.flash('success','User account has been made')
                res.redirect('/login');
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

    UserModel.authenticate(username,password)
        .then((loggedUserId) => {
            console.log(loggedUserId);
            if (loggedUserId > 0) {
                successPrint(`User ${username} is logged in`);
                req.session.username = username;
                req.session.userId = loggedUserId;
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