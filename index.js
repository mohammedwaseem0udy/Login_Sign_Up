let express = require("express");
let ejs = require('ejs');
const routes = require('./routes/routes');
const secret = require('./Vault/secrets');
const cookieParser = require('cookie-parser');
const app = express();


// middlewares
app.use(express.json());
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(cookieParser());

// paths
app.use(routes);

// app.listen(3000, function() {
//     console.log('Server is online.');
// })
let main = async function() {
    try {
        await secret.loadSecret();
        console.log('SUCCESSFULLY FETCHED VAULT SECRET');
        app.listen(3000, function() {
            console.log('Server is online.');
        })
    }
    catch(err) {
        console.log(err);
        process.exit();
    }
}

main();