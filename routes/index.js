var express = require('express');
var router = express.Router();
var {
  sequelize,
  Sequelize,
  Board
} = require("../models"); // 추가함

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log(Board); // Board 객체 출력됨
  res.render('index', {
    title: 'Express'
  });
});

module.exports = router;
