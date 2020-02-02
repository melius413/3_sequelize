var createError = require('http-errors');
var express = require('express');
var path = require('path');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var rfs = require('rotating-file-stream');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

var logDirectory = path.join(__dirname, 'log');

/* 
// method 1
// https://www.npmjs.com/package/morgan
// write logs to a file, single file
// create a write stream (in append mode)
// access.log에 로그를 남기겠음
// fs.createWriteStream 실시간 기록
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {
  flags: 'a'
});

// setup the logger
// 'combined' 로그를 계속 더해라.
app.use(logger('combined', {
  stream: accessLogStream
}));
// access.log가 생김
// end of method 1
*/

// method 2
// https://www.npmjs.com/package/morgan
// log file rotation
// rotating-file-stream >> 사용방법 바뀜 rfs() -> rfs.createStream()
// https://www.npmjs.com/package/rotating-file-stream
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// create a rotating write stream 
var accessLogStream = rfs.createStream('access.log', {
  size: "10M", // rotate every 10 MegaBytes written
  interval: "1d", // rotate daily
  compress: "gzip", // compress rotated files
  path: logDirectory
});

// setup the logger
app.use(logger('combined', {
  stream: accessLogStream
}));
// end of method 2


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// 미들웨어 등록
// app.use(logger('dev')); <-  해당부분 콘솔 출력에서 파일저장으로 대체... 
app.use(express.json()); // json 형태 파싱
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// app.use(url, function(req, res, next) {...}) ... 미들웨어 등록
// 등록된 순서대로 req가 지나감
// res.send를 만날때까지 계속 지나감
// next는 다음 미들웨어로 보내는 역할을 하는 함수.(필수)
// url이 있으면 해당 url만 지나감, 없으면 다 지나감
// app.use(url, function (req, res, next) {
//   res.locals.myName = 'r.code';
//   next(); // 여기가 없으면 응답이 없어서 계속 클라이언트 대기
// });

// catch 404 and forward to error handler
// 등록된 url이 없으면 무한 대기하는것이 아니라, 바로 에러 페이지 보내줌
// 404 대응, 파일없는 경우
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
// err 파라미터가 있음
// 중간에 있는 미들웨어는 에러발생시 next로 넘기나
// 마지막 미들웨어에서 err처리하므로 인자가 있음
// 500 에러
// use메소드가 use의 콜백이 첫번째 인자가 에러냐, req냐 확인한다.
// 콜백 인자의 순서는 바꾸면 안됨
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  // res.locals
  // req.app에 env 속성이 어딘가에 등록되어있음.
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // 개발모드면 에러시 콘솔창에 찍어라.


  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
