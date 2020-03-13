//dependencies
var express = require("express");
var mongoose = require("mongoose");
var logger = require("morgan");
//var handlebars = require("handlebars")

//web scraping tools
var axios = require("axios");
var cheerio = require("cheerio");
var request = require("request");

//initialize the application
var app = express();

//db for models
var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/scrapper'
mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

//morgan setup 
app.use(logger('dev'));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//port for localhost
// var PORT = 3000;
var PORT = process.env.PORT || 3000;

//routes

// var index = require("./routes/index");
// var articles = require("./routes/articles");
// var scrape = require("./routes/scrape");
var allRoutes = require("./routes/allRoutes");

app.use("/", allRoutes);
// app.use("/",index);
// app.use("/articles", articles);
// app.use("/scrape", scrape);

// initiate server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});