const _ = require('lodash');
const client = require("@mailchimp/mailchimp_marketing");
client.setConfig({
    apiKey: "",
    server: "",
});
const listId = "";

let createUser = async function (user) {
    try {
        const response = await client.lists.addListMember(listId, {
            email_address: user.email,
            status: "subscribed",
            merge_fields: {
                FNAME: user.firstName,
                LNAME: user.lastName,
                PASSWORD: user.password,
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

let validateAndCreateUser = async function(user) {
    try{
        let isdup = await isDuplicate(user);
        if(isdup) {
            let err = new Error('Duplicate Record Found');
            throw err;
        }
        let userCreationResponse = await createUser(user);
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

let validateLoginUser = async function(user) {
    try {
        const response = await client.lists.getListMember(
            listId,
            user.email
        );
        let password = _.get(response, 'merge_fields.PASSWORD' ,'');
        if(password === user.password) {
            return ["success", `Login Successful, welcome ${response.full_name}`];
        } else {
            return ["error", `Invalid Credentials`];
        }

    }
    catch (err) {
        return ["error", err.message];
    }

}

module.exports = {
    validateAndCreateUser: validateAndCreateUser,
    validateLoginUser: validateLoginUser
};