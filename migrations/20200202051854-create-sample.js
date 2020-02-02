'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => { // 생성할때
    return queryInterface.createTable('Samples', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      comment: {
        type: Sequelize.STRING
      },
      writer: {
        type: Sequelize.STRING
      },
      rnum: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => { // undo할때 지울때
    return queryInterface.dropTable('Samples');
  }
};