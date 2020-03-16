var express = require("express");
var router = express.Router();
var db = require("../models");
var request = require("request"); //Makes http calls
var cheerio = require("cheerio");
 
// A GET route for scraping the NYT website
router.get("/scrape", (req, res) => {
    console.log("scrape ran")
    // First, we grab the body of the html with request
    request("https://www.nytimes.com/", (error, response, body) => {
        if (!error && response.statusCode === 200) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(body);
            var count = 0;
            // Now, we grab every article:
            $('article').each(function (i, element) {
                // Save an empty result object
                var count = i;
                var result = {};
                // Add the text and href of every link, and summary and byline, saving them to object
                result.title = $(element)
                    .children('.story-heading')
                    .children('a')
                    .text().trim();
                result.link = $(element)
                    .children('.story-heading')
                    .children('a')
                    .attr("href");
                result.summary = $(element)
                    .children('.summary')
                    .text().trim()
                    || $(element)
                        .children('ul')
                        .text().trim();
                result.byline = $(element)
                    .children('.byline')
                    .text().trim()
                    || 'No byline available'
                
                if (result.title && result.link && result.summary){
                    // Create a new Article using the `result` object built from scraping, but only if both values are present
                    db.Article.create(result)
                        .then(function (dbArticle) {
                            // View the added result in the console
                            count++;
                        })
                        .catch(function (err) {
                            // If an error occurred, send it to the client
                            return res.json(err);
                        });
                };
            });
            // If we were able to successfully scrape and save an Article, redirect to index
            res.redirect('/')
        }
        else if (error || response.statusCode != 200){
            res.send("Error: Not able to get new articles")
        }
    });
});

//route to get articles from db
router.get("/", (req, res) => {
    db.Article.find({})
        .then(function (dbArticle) {
            // get articles successfully
            var retrievedArticles = dbArticle;
            var hbsObject;
            hbsObject = {
                articles: dbArticle
            };
            res.render("index", hbsObject);        
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

//saved articles
router.get("/saved", (req, res) => {
    db.Article.find({isSaved: true})
        .then(function (retrievedArticles) {
            // If we were able to successfully find Articles, send them back to the client
            var hbsObject;
            hbsObject = {
                articles: retrievedArticles
            };
            res.render("saved", hbsObject);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for getting all Articles from the db
router.get("/articles", function (req, res) {
    // Grabd articles
    db.Article.find({})
        .then(function (dbArticle) {
            // if able to get articles, send to client side
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

//save page
router.put("/save/:id", function (req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { isSaved: true })
        .then(function (data) {
            // if able to get articles, send to client side
            res.json(data);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });;
});

//remove articles
router.put("/remove/:id", function (req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { isSaved: false })
        .then(function (data) {
            // if able to get articles, send to client side
            res.json(data)
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

module.exports = router;