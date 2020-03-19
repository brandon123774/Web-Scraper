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
//var config = require("./config/db");
var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/scrapper'
mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });


// mongoose.Promise = Promise;
// mongoose
//     .connect(MONGODB_URI, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     })
//     .then(result => {
//         console.log(`Database Connected: '${result.connections[0].name}' on ${result.connections[0].host}:${result.connections[0].port}`);
//     })
//     .catch(err => console.log('Connection error:', err));

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
// GET request to render handlebars page

// app.get("/", function (req, res) {
//     db.Article.find({ saved: false }, function (error, data) {
//         var hbsObject = {
//             article: data
//         };
//         console.log(hbsObject);
//         res.render("home", hbsObject);
//     })
// })


// // A GET route for scraping from slate.com
// app.get('/scrape', function (req, res) {
//     request('http://www.slate.com/technology', function (err, res, html) {
//         var $ = cheerio.load(html);
    
//         $('article h3').each(function (i, element) {
//             console.log(element)
//             let result = {};

//             result.title = $(this).children('a').text();
//             result.link = $(this).children('a').attr('href');
//             console.log(result)

//             // Create a new article using result object built from scraping
//             db.Article.create(result)
//                 .then(function (dbArticle) {
//                     console.log(dbArticle);
//                 })
//                 .catch(function (err) {
//                     console.log(err);
//                 });
//         });
//         // Send a message to the client
//         res.send("Scrape Complete");
//     });
// });

// // This will get the articles we scraped from the mongoDB
// app.get("/articles", function (req, res) {
//     db.Article.find({})
//         .then(function (dbArticle) {
//             res.json(dbArticle);
//         })
//         .catch(function (err) {
//             res.json(err);
//         });
// });

// // Grab an article by it's ObjectId
// app.get('/articles/:id', function (req, res) {
//     db.Article.findOne({ _id: req.params.id })
//         .populate('note')
//         .then(function (dbArticle) {
//             res.json(dbArticle);
//         })
//         .catch(function (err) {
//             res.json(err);
//         });
// });

// // Save an article
// app.post('/articles/save/:id', function (req, res) {
//     db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true })
//         .then(function (dbArticle) {
//             res.json(dbArticle);
//         })
//         .catch(function (err) {
//             res.json(err);
//         });
// });

// // Delete an article
// app.post('/articles/delete/:id', function (req, res) {
//     db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: false, notes: [] }, function (err) {
//         if (err) {
//             console.log(err);
//             res.end(err);
//         }
//         else {
//             db.Note.deleteMany({ article: req.params.id })
//                 .exec(function (err) {
//                     if (err) {
//                         console.log(err);
//                         res.end(err);
//                     } else
//                         res.send("Article Deleted");
//                 });
//         }
//     });
// });


// initiate server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});