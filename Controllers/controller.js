const _ = require('lodash');
const notification = require('../Notifications/notification');
const users = require('./users');
const jwt = require('jsonwebtoken');

module.exports.renderHome = function (req, res) {
    const name = _.get(req, 'body.name', '');
    res.render('success', {name: name});
}

module.exports.renderLoginForm = function (req, res) {
    res.render('login');
}

module.exports.renderSignUpForm = function (req, res) {
    res.render('signup');
}

const jwtMaxAge = 3 * 24 * 60 * 60; 

let getJWT = function(id, name, loggedIn) {
    return jwt.sign({id, name, loggedIn},process.env.JWT_SECRET , {expiresIn: jwtMaxAge});
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
        notification.sendNotification('User creation successful', `User created successfully`);
        res.status(200).json({"userCreationStatus": "success", "serverResponse": serverResponse});
    } else {
        notification.sendNotification('User creation failed', `${serverResponse}`);
        res.status(400).json({"userCreationStatus": "failed", "serverResponse":  `${serverResponse}`});
    }
}

module.exports.loginUser = async function(req, res) {
    let body = _.get(req, "body", {});
    let data = {
        email: _.get(body, "email", ""),
        password: _.get(body, "password", ""),
    };
    let response = await users.validateLoginUser(data);
    let serverResponse = _.get(response, '1', {});
    if(serverResponse) {
        if(response[0] === 'success') {
            notification.sendNotification('Login Successful', 'Welcome');
            const jwt = getJWT(serverResponse.id, serverResponse.full_name, true);
            res.cookie('jwt', jwt, {httpOnly: true, maxAge: jwtMaxAge * 1000});
            res.status(200).json({user: response});
        } else {
            const error =  _.get(response, '[1].message', '')
            notification.sendNotification('Login Failed', error);
            res.status(400).json({error});
        }
    } else {
        const error =  _.get(response, '[1].message', '')
        notification.sendNotification('Login Failed', error);
        res.status(400).json({error});
    }
}

module.exports.logoutUser =  function(req, res) {
    res.cookie('jwt', '', {maxAge: 1});
    res.redirect('login');
}

