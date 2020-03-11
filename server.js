//dependencies
var express = require("express");
var mongoose = require("mongoose");
var logger = require("morgan");
var path = require("path");

//web scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// Requiring all models
var db = require("./models");

//port for localhost
var PORT = process.env.PORT || 3000;

//initialize the application
var app = express();

// initialize Express
var app = express();

//morgan setup 
app.use(logger("dev"));

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set Handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({
    defaultLayout: "main",
    partialsDir: path.join(__dirname, "/views/layouts/partials")
}));
app.set("view engine", "handlebars");


//db setup
//var config = require("./config/db");
var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/scrapper'
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


//routes stuff
app.get("/", function(req, res){
    db.Article.find({"saved": false}).then(function(result){
        // This variable allows us to use handlebars by passing the results 
        // from the database as the value in an object
        var hbsObject = { articles: result };
        res.render("index",hbsObject);
    }).catch(function(err){ res.json(err) });
});

// Scrapes tfrom slate.com
app.get("/scraped", function(req, res) {
    axios.get("https://www.slate.com/technology").then(function(response) {

      var $ = cheerio.load(response.data);

      $(".topic-story__hed").each(function(i, element) {
        var result = {};

        result.title = $(element).text();
    
        result.link = $(element).children("a").attr("href");

        result.summary = $(element).siblings(".entry-summary").text().trim();
    
        db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          console.log(err);
        });
      });
});
res.send("Scrape Finished");
});

// Displays any saved articles
app.get("/saved", function(req, res) {
    db.Article.find({"saved": true})
        .populate("notes")
        .then(function(result){
        var hbsObject = { articles: result };
        res.render("saved",hbsObject);
    }).catch(function(err){ res.json(err) });
});

// Posts any of the saved articles 
app.post("/saved/:id", function(req, res) {
    db.Article.findOneAndUpdate({"_id": req.params.id}, {"$set": {"saved": true}})
    .then(function(result) {
        res.json(result);
    }).catch(function(err){ res.json(err) });
})

// initiate server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
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

//routes

// var index = require("./routes/index");
// var articles = require("./routes/articles");
// var scrape = require("./routes/scrape");

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


