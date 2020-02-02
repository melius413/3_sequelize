var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');

  // try {} catch (err) {
  //   err.statue = 123;
  //   next(err); // 에러를 넥스트로 넘길수 있음
  // }
});

module.exports = router;
