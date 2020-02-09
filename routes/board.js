var express = require('express');
var dateTime = require('date-time');
var router = express.Router();
var {
  Board
} = require('../models'); // 해당 모델 사용시

/* GET users listing. */
/*
// Object.getPrototypeOf(data).constructor.name
router.get('/', async (req, res, next) => {

  // const data1 = await Board.findAll({ order: [["id", "desc"]] });
  // console.log(Object.getPrototypeOf(data1).constructor.name); // Array
  // console.log(Object.getPrototypeOf(data1[0]).constructor.name); // Board

  // console.log(data1[0].createdAt); // data[0].__proto__은 속성을 바로 접근하는 기능이 있음, 출력만 가능, 가공은 안됨
  // console.log(data1[0].dataValues.createdAt);

  // method 1
  // const data2 = [];
  // data1.forEach(v => { data2.push(v.dataValues); });
  // const data = data2.map(v => {
  //   v.createdAt = dateTime({ date: v.createdAt });
  //   return v;
  // });

  // method 2
  // const data = data1.map(v => {
  //   v.dataValues.createdAt = dateTime({ date: v.createdAt });
  //   return v;
  // });

  // method 3
  const data = await Board.findAll({
    order: [
      ["id", "desc"]
    ],
    raw: true // 해당 옵션이 없으면, 순수 obj 출력이 아님. 데이터 가공 힘듦
  });

  for (var v of data) { // es6
    v.createdAt = dateTime({
      date: v.createdAt
    });
  }

  // res.json(data);
  res.render('board-list.pug', {
    data
  });
});
*/

router.get(['/', '/:id'], async (req, res, next) => {
  try {
    let data;
    if (req.params.id) {
      if (req.params.id === "write") {
        res.render('board-write.pug');
      } else { // if (req.params.id === "write")
        data = await Board.findOne({
          where: {
            id: req.params.id
          },
          raw: true
        });
        res.json(data);
      }
    } else { // if (req.params.id)
      data = await Board.findAll({
        order: [
          ["id", "desc"]
        ],
        raw: true // 해당 옵션이 없으면, 순수 obj 출력이 아님. 데이터 가공 힘듦
      });

      for (var v of data) { // es6
        v.createdAt = dateTime({
          date: v.createdAt
        });
      }

      // res.json(data);
      res.render('board-list.pug', {
        data
      });
    }
  } catch (err) {
    next(err); // 이렇게 하면 에러 발생시 브라우저에 에러상태 나온다.
    // 배포시(production)에는 돌지 않는다. app.js에 설정되어 있음
  }
});

// router.get('/write', (req, res, next) => {
//   res.render('board-write.pug');
// });

router.get('/delete/:id', async (req, res) => {
  const data = await Board.destroy({
    where: {
      id: req.params.id
    }
  });
  // 성공하면 data 1, 실패 0
  // res.json(data);
  res.redirect('/board');
});


// method 1 promise: async-await
router.post('/wr', async (req, res, next) => {
  const data = await Board.create({
    title: req.body.title,
    comment: req.body.comment,
    writer: req.body.writer
  });
  // res.json(data);
  res.redirect("/board");
});

// method 2 promise: then catch
// method-overrid
router.put('/update', (req, res) => {
  // method 1 promise
  // Board.update().then().then().catch()
  const promise = Board.update({
    title: req.body.title,
    comment: req.body.comment,
    writer: req.body.writer
  }, {
    where: {
      id: req.body.id
    }
  });

  promise.then((data) => {
    if(data[0]) res.redirect("/board");
  }).catch((err) => {
    console.error(err);
  });

  /*
  // method 2 async-await: need to be async function 
  try {
    const data = await Board.update({
      title: req.body.title,
      comment: req.body.comment,
      writer: req.body.writer
    }, {
      where: {
        id: req.body.id
      }
    });
    res.json(data);
    // if(data[0]) res.redirect("/board");
  } catch (err) {
    next(err);
  }
  */
});

module.exports = router;