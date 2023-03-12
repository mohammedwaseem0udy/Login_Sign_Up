const _ = require('lodash');
const notification = require('../Notifications/notification');
const users = require('./users');
const jwt = require('jsonwebtoken');

module.exports.renderLoginForm = function (req, res) {
    res.render('login');
}

module.exports.renderSignUpForm = function (req, res) {
    res.render('signup');
}

const jwtMaxAge = 3 * 24 * 60 * 60; 

module.exports.getJWT = function(id) {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: jwtMaxAge});
}

module.exports.renderHomePage = function(req, res) {
    res.render('success');
}

module.exports.createUser = async function (req, res) {
    let body = _.get(req, "body", {});
    let data = {
        firstName: _.get(body, "firstName", ""),
        lastName: _.get(body, "lastName", ""),
        email: _.get(body, "email", ""),
        password: _.get(body, "password", ""),
    };
    let serverResponse = await users.validateAndCreateUser(data);
    if(serverResponse.hasOwnProperty('contact_id')) {
        const token = this.getJWT(serverResponse.contact_id);
        res.cookie(jwt, token, {httpOnly: true, maxAge: jwtMaxAge * 1000});
        notification.sendNotification('User creation successful', `Welcome ${serverResponse}`);
        res.json({"userCreationStatus": "success", "serverResponse": serverResponse});
    } else {
        notification.sendNotification('User creation failed', `${serverResponse}`);
        res.json({"userCreationStatus": "failed", "serverResponse":  `${serverResponse}`});
    }
}

module.exports.loginUser = async function(req, res) {
    let body = _.get(req, "body", {});
    let data = {
        email: _.get(body, "email", ""),
        password: _.get(body, "password", ""),
    };
    let response = await users.validateLoginUser(data);
    if(response[1]) {
        if(response[0] === 'success') {
            notification.sendNotification('Login Successful', response[1]);
            res.render('success', {name: response[1]});
        } else {
            notification.sendNotification('Login Failed', response[1]);
            res.render('failure', {message: response[1]})
        }
        
    } else {
        notification.sendNotification('Login Failed', response[1]);
        res.render('failure', {message: response[1]});
    }
}

module.exports.logoutUser =  function(req, res) {
    res.redirect('login');
}

