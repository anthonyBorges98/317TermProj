var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var handlebars = require('express-handlebars');
var sessions = require('express-session');
var mysqlSession = require('express-mysql-session')(sessions);
const errorPrint = require('./helpers/debug/debugPrinters').errorPrint;
var flash = require('express-flash');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postsRouter = require('./routes/posts');

var app = express();

app.engine(
    "hbs",
    handlebars({
        layoutsDir: path.join(__dirname, "views/layouts"),
        partialsDir: path.join(__dirname, "views/partials"),
        extname: ".hbs",
        defaultLayout: "home",
        helpers: {
          emptyObject: (obj) =>{
              return !(obj.constructor === Object && Object.keys(obj).length == 0);
          }
        },
    })
);
var mysqlSessionStore = new mysqlSession({
    /* using default options */
}, require('./conf/database'));
app.set("view engine", "hbs");

app.use(sessions({
    key: "csid",
    secret: "This is a secret",
    store: mysqlSessionStore,
    resave: false,
    saveUninitialized: false
}))
app.use(flash());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/public",express.static(path.join(__dirname, 'public')));

app.use((req,res,next) =>{
    if(req.session.username){
        res.locals.logged = true;
    }
    next();
})
app.use((err,req,res,next)=>{
    errorPrint(err);
    res.render('error',{err_message: err});
})
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
module.exports = app;
