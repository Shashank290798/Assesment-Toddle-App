const Sequelize = require('sequelize')

const sequelize= require('../utils/database')

const Assignment = sequelize.define('Assignment', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
        },
        description: {
        type: Sequelize.STRING,
        allowNull: false
        },
        publishedAt: {
        type: Sequelize.DATE,
        allowNull: false
        },
        deadline: {
        type:Sequelize.DATE,
        allowNull: false
        },
        status: {
        type: Sequelize.ENUM('SCHEDULED', 'ONGOING', 'SUBMITTED', 'OVERDUE'),
        defaultValue: 'ONGOING'
        },
        tutorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
        model: 'users',
        key: 'id'
        }
        }
})

module.exports=Assignment

