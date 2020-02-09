var createError = require('http-errors');
var express = require('express');
var path = require('path');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var rfs = require('rotating-file-stream');
var methodOverride = require('method-override'); // 폼전송에 필요하다. ajax에서는 필요없음

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var boardRouter = require('./routes/board');

var app = express();
app.locals.pretty = true;

var { // 시퀄라이즈 실행
  sequelize
} = require('./models');

// 아래 부분에서 실제 db가 생성됨
// cli 명령 >> $ sequelize db:migrate // sequelize.sync 스크립트를 대체하므로 아래부분 주석가능
// cli에서 하는것이 더 안전함
sequelize.sync({
  force: false // true, 기존에 모델이 있으면 지우고 실행
});

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
var logDirectory = path.join(__dirname, 'log');

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

// 미들웨어 등록 (미들웨어 등록순서가 중요하다. 순서대로 req 객체가 통과한다.)
// app.use(logger('dev')); <-  해당부분 콘솔 출력 => 파일저장으로 대체... 
app.use(express.json()); // json 형태 파싱
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// method-override
// custom logic
// https://www.npmjs.com/package/method-override
// 폼전송에 필요하다. ajax에서는 필요없음
// app.use(express.json()) 이후에 등록해야한다.
// app.use(express.urlencoded({extended: false})) 이후에 등록해야한다.
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}));

// 라우터의 순서도 중요하다.
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/board', boardRouter);

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
