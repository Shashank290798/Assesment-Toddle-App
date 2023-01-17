const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const sequelize = require('sequelize');
const Assignment = require('../models/assignments')
const Submission = require('../models/submission')
const User = require('../models/user')

function generateAccessToken(id)
{
    return jwt.sign({userId:id},'process.env.SECRET')
    
}

function isstringinvalid(string)
{
    if(string == undefined || string.length === 0)
    {
        return true
    }
    else
    {
       return false
    }
}
exports.signup = async (req,res)=>{
        try{
            const {name,email,password,role} = req.body;
            if(isstringinvalid(name) || isstringinvalid(email) || isstringinvalid(password) || isstringinvalid(role))
            {
            return res.status(400).json({err:"bad parameters . something is missing"})
            }
            const saltrounds =10;
            bcrypt.hash(password, saltrounds , async (err,hash) => {
            console.log(err)    
            await User.create({name,email,password:hash,role})
            res.status(201).json({message:'Successfully created'})
        })
        }
     catch(err){
        res.status(500).json({err})
    }
}
// need to login for JWT Token generation
exports.login= async(req,res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;

        const User = await  user.findAll({where:{email:email}})
       console.log(User)
       if(User.length > 0)
       {
        bcrypt.compare(password,User[0].password,(err,result)=>{
            if(err)
            {
                res.status(500).json({success:false , message:"something went wrong"})
            }
            if(result == true)
            {
               
                res.status(200).json({success:true , message:"user is successfully logged" , token: generateAccessToken(User[0].id)})
            }
            else
            {
                return res.status(400).json({success:false , message:"Password is incorrect"})
            }
           })
       }
    }
    catch(err){
        res.status(404).json({message:"user doesn't exist",err})
    }
}

exports.Create =((req, res) => {
    // Check if the user making the request is a tutor
    if (req.user.role !== 'tutor') {
      return res.status(401).send('Unauthorized request');
  }
  // Create the assignment
  Assignment.create({
      description: req.body.description,
      publishedAt: req.body.publishedAt,
      deadline: req.body.deadline,
      students: req.body.students
  }).then(assignment => {
      res.json(assignment);
  }).catch(err => {
      res.status(500).send(err);
  });
});

exports.Update =((req, res) => {
    // Check if the user making the request is a tutor
    if (req.user.role !== 'tutor') {
      return res.status(401).send('Unauthorized request');
  }
  // Update the assignment
  Assignment.update({
      description: req.body.description,
      publishedAt: req.body.publishedAt,
      deadline: req.body.deadline,
      students: req.body.students
  }, {
      where: {
          id: req.params.id
      }
  }).then(assignment => {
      res.json(assignment);
  }).catch(err => {
      res.status(500).send(err);
  });
});
exports.Delete=((req, res) => {
   // Check if the user making the request is a tutor
   if (req.user.role !== 'tutor') {
    return res.status(401).send('Unauthorized request');
}

// Delete the assignment
Assignment.destroy({
    where: {
        id: req.params.id
    }
}).then(() => {
    res.json({ message: 'Assignment deleted' });
}).catch(err => {
    res.status(500).send(err);
  });
});

exports.Submission= ((req, res) => {
    // Check if the user making the request is a student
    if (req.user.role !== 'student') {
      return res.status(401).send('Unauthorized request');
  }
  // Check if the student has already submitted for this assignment
  Submission.findOne({
      where: {
          studentId: req.user.id,
          assignmentId: req.body.assignmentId
      }
  }).then(submission => {
      if (submission) {
          return res.status(401).send('You have already submitted for this assignment');
      }
      // Add the submission
      Submission.create({
          remark: req.body.remark,
          studentId: req.user.id,
          assignmentId: req.body.assignmentId
      }).then(submission => {
          // Update the assignment status for the student
          Assignment.update({
              status: 'SUBMITTED'
          }, {
              where: {
                  id: req.body.assignmentId,
                  students: {
                      [sequelize.Op.contains]: [req.user.id]
                  }
              }
          }).then(() => {
              res.json(submission);
          }).catch(err => {
              res.status(500).send(err);
          });
      }).catch(err => {
          res.status(500).send(err);
      });
  }).catch(err => {
      res.status(500).send(err);
  });
});

exports.assignment= ((req, res) => {
    if (req.user.role === 'student') {
        // Get the student's submission for the assignment
        Submission.findOne({
        where: {
        studentId: req.user.id,
        assignmentId: req.params.id
        }
        }).then(submission => {
        res.json(submission);
        }).catch(err => {
        res.status(500).send(err);
        });
        } else if (req.user.role === 'tutor') {
        // Get all submissions for the assignment
        Submission.findAll({
        where: {
        assignmentId: req.params.id
        },
        include: [{
        model: User,
        as: 'student'
        }]
        }).then(submission => {
        res.json(submission);
        }).catch(err => {
        res.status(500).send(err);
        });
        }
});

exports.Feed= ((req, res) => {
  let filter = {};
  if (req.query.publishedAt) {
      filter.publishedAt = {
          [sequelize.Op.eq]: req.query.publishedAt
      }
  }
  if (req.user.role === 'tutor') {
      // Get all assignments created by the tutor
      filter.tutorId = req.user.id;
      Assignment.findAll({
          where: filter
      }).then(assignments => {
          res.json(assignments);
      }).catch(err => {
          res.status(500).send(err);
      });
  } else if (req.user.role === 'student') {
      // Get all assignments assigned to the student
      filter.students = {
          [sequelize.Op.contains]: [req.user.id]
      };
      if (req.query.status) {
          filter.status = {
              [sequelize.Op.eq]: req.query.status
          }
      }
      Assignment.findAll({
          where: filter
      }).then(assignments => {
          res.json(assignments);
      }).catch(err => {
          res.status(500).send(err);
      });
  } else {
      res.status(401).send('Unauthorized request');
  }
});

