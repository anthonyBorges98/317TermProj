var express = require('express');
var router = express.Router();
var db = require('../conf/database');

const UserError = require('../helpers/error/UserErrors');
const { successPrint, errorPrint } = require('../helpers/debug/debugPrinters');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register',(req,res,next) =>{
  let username = req.body.username;
  let password = req.body.password;
  let email = req.body.email;
  let passConfirm = req.body.passConfirm

  /**
   * DO SERVER SIDE VALIDATION HERE
   */

  db.execute("SELECT * FROM users WHERE username=?",[username])
      .then(([results, fields]) => {
        if(results && results.length == 0){
          return db.execute("SELECT * FROM users WHERE email=?;" , [email]);
        }else{
          throw new UserError(
              "Registration failed: Username already exists",
              "/registration",
              200
          );
        }
      }).then(([results,fields]) => {
    if(results && results.length == 0){
      let baseSQL = "INSERT INTO users (username,email,password,created) VALUES(?,?,?,now());"
      return db.execute(baseSQL,[username,email,password])
    }else{
      throw new UserError(
          "Registration failed: Email already exists",
          "/registration",
          200
      );
    }
  }).then(([results,fields]) => {
    if(results && results.affectedRows){
      successPrint("users.js --> User was created!!");
      res.redirect('/login');
    }else{
      throw new UserError(
        "Server error, user could not be created",
        "/registration",
        500
      );
    }
  })
      .catch((err) =>{
        errorPrint("User could not be made", err);
        if(err instanceof UserError){
          errorPrint(err.getMessage());
          res.status(err.getStatus());
          res.redirect(err.getRedirectURL());
        }else{
          next(err);
        }
      });
});

module.exports = router;

router.post('/login', (req,res,next) =>{
  let username = req.body.username;
  let password = req.body.password;
  /**
   * DO SERVER SIDE VALIDATION
   * NOT DONE IN VIDEO
   * DO ON OUR OWN
   */

  let baseSQL = "SELECT username, password FROM users WHERE username=? AND password=?;"
  db.execute(baseSQL,[username,password])
      .then(([results, fields])=>{
        if(results && results.length == 1){
          successPrint(`User ${username} is logged in`);
          res.locals.logged = true;
          res.render('index');
        }else{
          throw new UserError("Invalid username or password", "/login",200);
        }
      })
      .catch((err)=>{
        if(errorPrint(err instanceof UserError)){
          errorPrint(err.getMessage());
          res.status(err.getStatus());
          res.redirect('/login');
        }else{
          next(err);
        }
      });
});