const express= require('express');
const app =express();
const cors = require('cors');
const bodyParser =require('body-parser');
const sequelize = require('./utils/database');
const appRoutes = require('./routes/router');



const User = require('./models/user');
const Assignment = require('./models/assignments');
const Submission = require('./models/submission');




app.use(cors());
app.use(bodyParser.json());

app.use(appRoutes)

User.hasMany(Assignment,
    {
    as: 'createdAssignments',
    foreignKey: 'tutorId'
    });
    
    Assignment.belongsTo(User, {
    as: 'tutor',
    foreignKey: 'tutorId'
    });
    
    Assignment.hasMany(Submission, {
    as: 'submissions',
    foreignKey: 'assignmentId'
    });
    
    Submission.belongsTo(User, {
    as: 'student',
    foreignKey: 'studentId'
    });
    
    Submission.belongsTo(Assignment, {
    as: 'assignment',
    foreignKey: 'assignmentId'
    });
    
    User.belongsToMany(Assignment, {
    as: 'assignedAssignments',
    through: 'studentAssignment',
    foreignKey: 'studentId',
    otherKey: 'assignmentId'
    });
    
    Assignment.belongsToMany(User, {
    as: 'students',
    through: 'studentAssignment',
    foreignKey: 'assignmentId',
    otherKey: 'studentId'
    });
    
    // Create hooks for updating assignment status
    Assignment.addHook('beforeCreate', (assignment) => {
    if (assignment.publishedAt > new Date()) {
    assignment.status = 'SCHEDULED';
    } else {
    assignment.status = 'ONGOING';
    }
    });
    
    Assignment.addHook('beforeUpdate', (assignment) => {
    if (assignment.publishedAt > new Date()) {
    assignment.status = 'SCHEDULED';
    } else {
    assignment.status = 'ONGOING';
    }
    });
    
    Submission.addHook('beforeCreate', (submission) => {
    submission.getAssignment()
    .then(assignment => {
    assignment.update({
    status: 'SUBMITTED'
    });
    });
    });
    
    Submission.addHook('beforeUpdate', (submission) => {
    submission.getAssignment()
    .then(assignment => {
    assignment.update({
    status: 'SUBMITTED'
    });
    });
});



sequelize
// .sync({force:true})   used to drop all table
.sync()
.then(result =>{
    app.listen(3000);
    console.log('Server started on port 3000');
})
.catch(err =>{
    console.log(err)
})