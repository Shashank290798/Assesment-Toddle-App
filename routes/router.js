const express = require('express');

const userController = require('../controllers/user')
const Middleware= require('../middleware/auth')


const router = express.Router();

router.post('/signup',userController.signup)

router.post('/login',userController.login)

router.post('/assignments',Middleware.authenticate, userController.Create)

router.put('/assignments/:id',Middleware.authenticate, userController.Update)

router.delete('/assignments/:id',Middleware.authenticate, userController.Delete)

router.post('/submissions',Middleware.authenticate, userController.Submission)

router.get('/assignments/:id',Middleware.authenticate, userController.assignment)

router.get('/assignments/feed',Middleware.authenticate, userController.Feed)

module.exports = router;
