var express = require('express');
var router = express.Router();
var isLoggedIn = require('../middleware/routerprotectors').userIsLoggedIn;
const {getRecentPosts, getPostById,getCommentsForPost} = require('../middleware/postsmiddleware');
var db = require('../conf/database');
/* GET home page. */
router.get('/', getRecentPosts,function(req, res, next) {
  res.render('index');
});

router.get('/login', (req,res,next) => {
  res.render('login');
});

router.get('/registration', (req,res,next) => {
  res.render('registration');
});

router.get('/home', (req,res,next) => {
  res.render('home');
});

router.get('/imagepost', (req,res,next) => {
  res.render('imagepost');
});

router.use('/postimage', isLoggedIn);
router.get('/postimage', (req,res,next) => {
  res.render('postimage');
});
router.get('/post/:id(\\d+)' , getPostById,getCommentsForPost, (req,res,next) =>{
  res.render('imagepost', {title: `Post ${req.params.id}`});
});
module.exports = router;
