var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')
const session = require('express-session')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// 配置body-parser
// 只要加入这个配置，则在req请求对象上会多出来一个属性：body
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/public/',express.static(path.join(__dirname,'./public/')))

////应用session
app.use(session({
  secret: 'keyboard cat',//配置加密字符串，他会在原有加密基础上加上这个字符串去加密，增加安全性
  resave: false,
  saveUninitialized: true,//无论你是否使用session都默认分配一把钥匙
  cookie: {
    maxAge:  24*60*60*1000  // 有效期，单位是毫秒
  }
}))

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());  //中间件
app.use(express.urlencoded({ extended: false }));
//应用cookie
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

require('./db/models')(app)
//引入路由
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
//
//
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// app.use(function (err,req,res,next) {
//   res.send({
//     err_code: 500,
//     msg: e.message
//   })
// })

module.exports = app;
