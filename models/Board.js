// var {sequelize, Sequelize} = require('./index');
// console.log(db);

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