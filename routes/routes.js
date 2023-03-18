const express = require('express');
const router = express.Router()
const controllers = require('../Controllers/controller');
const authorization = require('../Controllers/authMiddleware');

router.get("/", authorization.isLoggedIn, controllers.renderHome);

router.get("/signup", authorization.checkAlreadyLoggedIn, controllers.renderSignUpForm);

router.get('/login', authorization.checkAlreadyLoggedIn, controllers.renderLoginForm);

router.post("/create-user", controllers.createUser);

router.post('/validate-login-user', controllers.loginUser);

router.post('/logout', controllers.logoutUser);


module.exports = router