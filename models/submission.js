const Sequelize = require('sequelize')

const sequelize= require('../utils/database')

const Submission = sequelize.define('Submission', {


  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
    },
    remark: {
    type: Sequelize.STRING,
    allowNull: false
    },
    studentId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
    model: 'users',
    key: 'id'
    }
    },
    assignmentId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
    model: 'assignments',
    key: 'id'
    }
  }
  
});



module.exports=Submission

