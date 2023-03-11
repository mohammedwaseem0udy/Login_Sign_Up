const express = require('express');
const router = express.Router()
const controllers = require('../Controllers/controller');

router.get("/", controllers.renderLoginForm);

router.get("/signup", controllers.renderSignUpForm);

router.get('/login', controllers.renderLoginForm);

router.post("/create-user", controllers.createUser);

router.post('/validate-login-user', controllers.loginUser);

router.post('/logout', controllers.logoutUser);

module.exports = router