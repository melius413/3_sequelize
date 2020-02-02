var express = require('express');
var dateTime = require('date-time');
var router = express.Router();
var {
  Board
} = require('../models'); // 해당 모델 사용시

/* GET users listing. */

router.get(['/', '/:id'], async (req, res, next) => {
  let data;
  try {
    if (req.params.id) {
      if (req.params.id === "write") {
        res.render('board-write.pug');
      } else {
        data = await Board.findOne({
          where: {
            id: req.params.id
          },
          raw: true
        });
        res.json(data);
      }
    } else {
      data = await Board.findAll({
        order: [
          ["id", "desc"]
        ],
        raw: true
      });

      // const data2 = data;
      // const data2 = data.map((v) => {
      //   v.createdAt = dateTime({
      //     date: v.createdAt
      //   });
      //   return v;
      // });

      for (var v of data) { // es6
        v.createdAt = dateTime({
          date: v.createdAt
        });
      }

      const data2 = data;
      res.render('board-list.pug', {
        data2
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

router.post('/wr', async (req, res, next) => {
  const data = await Board.create({
    title: req.body.title,
    comment: req.body.comment,
    writer: req.body.writer
  });
  res.redirect("/board");
});

// method-overrid
router.put('/update', (req, res) => {

});


module.exports = router;