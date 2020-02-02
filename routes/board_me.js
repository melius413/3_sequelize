var express = require('express');
var dateTime = require('date-time');
var router = express.Router();
var {
  Board
} = require('../models'); // 해당 모델 사용시

/* GET users listing. */

router.get('/me', async (req, res, next) => {
  const data = await Board.findAll();
  let lists = [];
  for (let i = 0; i < data.length; i++) {
    lists[i] = {
      id: data[i].dataValues.id,
      title: data[i].dataValues.title,
      comment: data[i].dataValues.comment,
      createdAt: data[i].dataValues.createdAt
    }
  }

  console.log(data[0].dataValues.id);
  console.log(data[0].dataValues.title);
  console.log(data[0].dataValues.comment);
  res.render('board-list2.pug', lists);
});

router.get('/', async (req, res, next) => {
  const data = await Board.findAll({
    order: [
      ["id", "desc"]
    ],
    // raw: true // 해당 옵션이 없으면, 순수 obj가 아니라서 v.createdAt에 값 기록이 안됨, 데이터 가공시에필요
  });

  // data는 객체가 아니라 모델이다.
  console.log(data[0].createdAt);

  // method1
  console.log(Object.getPrototypeOf(data).name); // ???
  const data2 = data.map(v => {
    console.log(v.createdAt);
    v.createdAt = dateTime({
      date: v.createdAt
    });
    console.log(v.createdAt); // 변환이 안됨
    v.wdate = dateTime({
      date: v.createdAt
    });
    console.log(v.wdate); // 변환됨
    return v;
  });
  console.log(data[0].createdAt); // 비동기라서 변환된게 안 보인다??
  res.render('board-list.pug', {
    data2
  });

  // method2
  // for(var v of data) { // es6
  //   v.createdAt = dateTime({date: v.createdAt});
  // }
  // res.json(data);
});

// test용
// router.get('/wr_test', async (req, res, next) => {
//   const data = await Board.create({
//     title: "test",
//     comment: "테스트 글",
//     writer: "작성자"
//   });
//   res.json(data);
// });

router.get('/write', (req, res, next) => {
  res.render('board-write.pug');
});

router.post('/wr', async (req, res, next) => {
  const data = await Board.create({
    title: req.body.title,
    comment: req.body.comment,
    writer: req.body.writer
  });
  res.redirect("/board");
});


module.exports = router;