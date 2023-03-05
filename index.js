let express = require("express");
let bodyParser = require("body-parser");
let _ = require("lodash");
let users = require("./users");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/login.html");
});

app.get("/signup", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/create-user", async function (req, res) {
    let body = _.get(req, "body", {});
    let data = {
        firstName: _.get(body, "firstName", ""),
        lastName: _.get(body, "lastName", ""),
        email: _.get(body, "email", ""),
        password: _.get(body, "password", ""),
    };
    let serverResponse = await users.validateAndCreateUser(data);
    if(serverResponse.hasOwnProperty('contact_id')) {
        res.send(`<h1> User Created Successfully </h1>`);
    } else {
        res.send(`${serverResponse}`);
    }
})

app.listen(3000, function () {
    console.log("Server is Online");
});
