# Express + Sequelize 세팅

## 1. 최초 한번 설치
~~~bash
npm i -g express-generator
npm i -g sequelize-cli
~~~

## 2. 프로젝트 생성
~~~bash
# express 프로젝트 생성
express --view=pug projectFolder(생성폴더명)

# 생성 프로젝트 폴더로 이동
cd projectFolder

# package.json의 모듈 설치
npm i

# sequelize / mysql2 설치
npm i sequelize mysql2

# sequelize 프로젝트 생성
sequelize init
~~~

## 3. 프로젝트 마이그레이션
~~~js
// Models 폴더에 Model 생성
// models/Board.js
module.exports = (sequelize, Sequelize) => {
    // define 클래스 메소드
    return sequelize.define('Board', { // setting
        title: {
            type: Sequelize.STRING(255)
        },
        writer: {
            type: Sequelize.STRING(255)
        },
        img: {
            type: Sequelize.STRING(255)
        },
        comment: {
            type: Sequelize.TEXT()
        }
    }, { // option
        timestamps: true, // 기본값이 true, 자동 시간저장, table에 createAt, updatedAt 필드 생성됨
        charset: 'utf8',
        tableName: 'boards'
    });
};

// app.js
var {sequelize} = require('./models');
sequelize.sync({force: false}); // true, 기존에 모델이 있으면 지우고 다시 생성

// 모델도 가지고 오고 싶으면 추가
var {sequelize, Board} = require('./models');


// 라우터 등록
// routes/board.js
const{Board} = require("./models");
//const{Board} = require("./models/index"); // 같은 의미
//const{Board} = require("./models/index.js");
~~~

## sequelize cli 명령
~~~bash
# model 생성
$ sequelize model:generate --name User2 --attributes firstName:string,lastName:string,email:string
$ sequelize model:generate --name Sample --attributes title:string,comment:string,writer:string,rnum:integer

# db에 생성
sequelize db:migrate
~~~

## pm2 설치
~~~bash
npm install pm2 -g
pm2 start app.js

# 3개 CPU에서 구동
pm2 start app.js -i 3

# 모든 CPU에서 구동
pm2 start app.js -i 0  
pm2 kill

# list 보기
pm2 list

# log 보기
pm2 log

pm2 start ./bin/www -i 0 
pm2 show 0 # 0번 상황 확인
~~~
