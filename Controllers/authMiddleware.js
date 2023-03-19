const jwt = require('jsonwebtoken');
const _ = require('lodash');

let isLoggedIn = function(req, res, next) {
    let token = _.get(req, 'cookies.jwt', '');
    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
            if(err) {
                console.log(err);
                res.redirect('/login');
            }
            else {
                if(decoded.loggedIn === true) {
                    _.extend(req.body, decoded);
                    next();
                } else {
                    res.redirect('/login');
                }
            }
        })
    }
    else {
        res.redirect('/login');
    }
}

let checkAlreadyLoggedIn = function(req, res, next) {
    let token = _.get(req, 'cookies.jwt', '');
    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
            if(err) {
                console.log(err);
                next();
            }
            else {
                if(decoded.loggedIn === true) {
                    res.redirect('/');
                } else {
                    next();
                }
            }
        })
    }
    else {
        next();
    }
}

module.exports = {
    isLoggedIn: isLoggedIn,
    checkAlreadyLoggedIn: checkAlreadyLoggedIn
}