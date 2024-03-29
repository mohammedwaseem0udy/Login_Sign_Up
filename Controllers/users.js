const _ = require('lodash');
const client = require("@mailchimp/mailchimp_marketing");
const bcrypt = require('bcrypt');
let dotenv = require('dotenv');
dotenv.config();
const saltRounds = 10;

client.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: process.env.MAILCHIMP_SERVER_ID,
});
const listId = process.env.MAILCHIMP_LIST_ID;

let createUser = async function (user, hashedPassword) {
    try {
        const response = await client.lists.addListMember(listId, {
            email_address: user.email,
            status: "subscribed",
            merge_fields: {
                FNAME: user.firstName,
                LNAME: user.lastName,
                PASSWORD: hashedPassword,
            },
        });
        return ['success', response];
    }
    catch (err) {
        console.log(err);
        return ['failure', err];
    }
};

let isDuplicate = async function (user) {
    try {
        const response = await client.lists.getListMember(
            listId,
            user.email
        );
        return true;
    }
    catch (err) {
        if(err.message === 'Not Found'){
            return false;
        }
    }
}


let generateHashedPassword = async function(user) {
    try {
        let password = _.get(user, 'password', '');
        let hashpassword = await bcrypt.hash(password, saltRounds);
        return hashpassword;
    }
    catch(err) {
        console.log(err);
        return err;
    }
}

let validateAndCreateUser = async function(user) {
    try{
        let isdup = await isDuplicate(user);
        if(isdup) {
            let err = new Error('Duplicate Record Found');
            throw err;
        }
        let hashedPassword = await generateHashedPassword(user);
        let userCreationResponse = await createUser(user, hashedPassword);
        if(userCreationResponse[0] === 'failure') {
            let err = new Error('User Creation Failed');
            throw err;
        }
        return userCreationResponse[1];
    }
    catch(err) {
        return err;
    }
}

let validatePassword = async function(password, hash) {
    return await bcrypt.compare(password, hash);
}

let validateLoginUser = async function(user) {
    try {
        const response = await client.lists.getListMember(
            listId,
            user.email
        );
        let hash = _.get(response, 'merge_fields.PASSWORD' ,'');
        let isPasswordValidMatch = await validatePassword(user.password, hash);
        if(isPasswordValidMatch) {
            return ["success", response];
        } else {
            let error = new Error("Invalid Credentials");
            throw error;
        }
    }
    catch (err) {
        return ["error", err];
    }

}

module.exports = {
    validateAndCreateUser: validateAndCreateUser,
    validateLoginUser: validateLoginUser
};