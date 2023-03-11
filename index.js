let express = require("express");
let bodyParser = require("body-parser");
let ejs = require('ejs');
const routes = require('./routes/routes');
const app = express();


// middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

// paths
app.use(routes);
app.listen(3000, function() {
    console.log('Server is online.');
})
