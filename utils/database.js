const Sequelize = require('sequelize')
// password to connect database
const sequelize = new Sequelize('toddleapp', 'root', 'password',{
    dialect: 'mysql',
    host:'localhost'
});

module.exports = sequelize;