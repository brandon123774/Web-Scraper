// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
// var request = require("request");
// var cheerio = require("cheerio");

//model
var db = require("./models");

// connection
var PORT = process.env.PORT || process.argv[2] || 3000;

// Initialize Express
var app = express();

// Use body-parser 
app.use(bodyParser.urlencoded({ extended: true }));

// Handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Use express.static 
app.use(express.static("public"));

// route
var router = require("./routes/allRoutes");
app.use(router);

// Connect to the Mongo DB
//db for models
var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/scrapper'
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// Start the server
app.listen(PORT, function () {
    console.log(`This application is running on port: ${PORT}`);
});