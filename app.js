
//const createError = require('http-errors');
const express = require('express');
const path = require('path');
//const cookieParser = require('cookie-parser');
const redis = require('redis');

const client = redis.createClient();
const mysql=require('mysql');
const mysqlConnection = require('express-myconnection');
const session = require('express-session');
const redisStore = require('connect-redis')(session);
const logger = require('morgan');
const config=require('./config.json');
const errorView=require('./views/error');
const langServer=require('./lang/server');


const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const appRouter = require('./routes/app');


const app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'html');

app.use(logger('dev'));

app.use(session({
  secret:process.env.SESSION_SECRET,
  name: process.env.SESSION_NAME,
  cookie: {
    domain: '',
    maxAge: (3600000 * 5),
    httpOnly: true,
    path: '/',
    sameSite: false,
    secure: false
  },
  store: new redisStore({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    client: client
  }),
  saveUninitialized: false,
  resave: true,
  rolling: true,
  ttl: 3600 * 2
}));

app.use(mysqlConnection(mysql,{
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: 'test',
  dateStrings: true,
  multipleStatements: true
},'request'));

app.use(function(req,res,next){

  if(!req.session.user){

    req.session.user={
      guest:1
    };

    req.session.login={
      reCaptcha: config.login.reCaptcha,
      blocked:0,
      failed: {
        attempt:0,
        msg:''
      }
    };

    req.session.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    req.session.lang=langServer;
  }

  next();
})

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

//app.use(cookieParser('_ema_'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(config.url.root, indexRouter);
app.use(config.url.login,authRouter);
app.use(config.url.root,appRouter);

app.use(function(req, res, next) {

  let err = new Error(req.session.lang.httpError['404']);

  err.status = 404;

  next(err);
});

app.use(function(err, req, res, next) {

  console.log(err)

  //logger error.message

  err.status=err.status || 500;

  errorView(req,res,err)
});

module.exports = app;
