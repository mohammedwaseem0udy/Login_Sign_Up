const client = require("@mailchimp/mailchimp_marketing");
client.setConfig({
    apiKey: "2c203cd1de633425708e9e1c0f738241-us21",
    server: "us21",
});
const listId = "3bc90ecc13";

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



module.exports = {
    validateAndCreateUser: validateAndCreateUser
};
