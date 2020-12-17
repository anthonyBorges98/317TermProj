var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var handlebars = require('express-handlebars');
var sessions = require('express-session');
var mysqlSession = require('express-mysql-session')(sessions);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dbRouter = require('./routes/dbtest');

var app = express();

app.engine(
    "hbs",
    handlebars({
        layoutsDir: path.join(__dirname, "views/layouts"),
        partialsDir: path.join(__dirname, "views/partials"),
        extname: ".hbs",
        defaultLayout: "home",
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
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/public",express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/dbtest', dbRouter);
app.use('/users', usersRouter);

module.exports = app;
