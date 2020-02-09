'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// fs.readdir(__dirname, cb); // 현재 지정된 폴더의 모든 내용읽어옴
// fs.readdirSync(); // 동기메소드 출력은 Array
// .filter와 forEach는 자바스크립트 Array 객체의 메소드
// Array.forEach((v, i, arr) => {}), forEach는 비동기 매소드

// models안에 있는 모든 js를 가져오는 과정
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

// Object.keys(db) ... 키추출
// 파일이름을 모델이름으로 등록하는 과정
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// 각모델 접근가능
// 테이블 1:n 관계설정
db.Member.hasMany(db.Post);
db.Post.belongsTo(db.Member);

// 테이블 n:n 관계설정
db.Post.belongsToMany(db.Hash, {
  through: 'post_hash' // 관계설정 테이블 이름
});

db.Hash.belongsToMany(db.Post, {
  through: 'post_hash' // 관계설정 테이블 이름
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
