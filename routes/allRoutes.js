var express = require("express");
var router = express.Router();
var db = require("../models");
var request = require("request"); 
var cheerio = require("cheerio");
 
// A GET route for slate/technology
router.get("/scrape", (req, res) => {
    console.log("index route")
    request("https://www.slate.com/technology", (error, response, body) => {
        if (!error && response.statusCode === 200) {
            // cheerio
            var $ = cheerio.load(body);
            var count = 0;
            // grab articles
            $('.topic-story').each(function (i, element) {
                // Save an empty result object
                let count = i;
                let result = {};
                // Add the wanted info elements
                result.title = $(element)
                    .children('.topic-story')
                    // .children('a')
                    .text().trim();
                result.link = $(element)
                    .children('.topic-story')
                    .children('a')
                    .attr("href");
                // result.summary = $(element)
                //     .children('p')
                //     .text().trim()
                //     || $(element)
                //         .children('ul')
                //         .text().trim();
                
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
            res.send("Error: Unable to obtain new articles")
        }
    });
});

router.get("/", (req, res) => {
    db.Article.find({})
        .then(function (dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
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
    // Grab every document in the Articles collection
    db.Article.find({})
        .then(function (dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

router.put("/save/:id", function (req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { isSaved: true })
        .then(function (data) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(data);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });;
});

router.put("/remove/:id", function (req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { isSaved: false })
        .then(function (data) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(data)
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});



module.exports = router;