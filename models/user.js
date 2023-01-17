const Sequelize = require('sequelize')

const sequelize= require('../utils/database')

const User = sequelize.define('User', {
  id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
  },
  email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
  },
  password: {
      type: Sequelize.STRING,
      allowNull: false
  },
  role: {
      type: Sequelize.ENUM('tutor', 'student'),
      allowNull: false
  }
});

module.exports=User




