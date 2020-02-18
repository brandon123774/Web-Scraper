//Dependencies
var express = require('express');
var cheerio = require('cheerio');
var router = express.Router();
var db = require('../models');
var axios = require("axios");

//route to scrape new articles
router.get("/newArticles", function (req, res) {
    //options
    console.log("scrape route")
    var options = {
        uri: 'https://slate.com/technology',
        transform: function (body) {
            return cheerio.load(body);
        }
    };
    //calling the db to return articles
    // db.Article
    //     .find({})
    //     .then((savedArticles) => {
    //creating an array of saved article headlines
    //      var $ = cheerio.load(savedArticles)
    // axios call 
axios.get(options.uri).then(function(response){
   // console.log(response.data)
    var $ = cheerio.load(response.data)

    var newArticleArray = []
    //var savedHeadlines = savedArticles.map(article => article.headline);

    //iterating over returned articles, and creating a newArticle object from the data
    $('.topic-story').each((i, element) => {
        //console.log(element)
        console.log("--->",  $(element).find('img').attr('data-src'))
        var newArticle = new db.Article({
            storyUrl: $(element).attr("href"),
            storyUrl: `https://www.slate.com/technology${$(element).find('a').attr('href')}`,
            headline: $(element).find('.topic-story__hed').text().trim(),
           // summary: $(element).find('p').text().trim(),
            imgUrl: $(element).find('img').attr('data-src'),
        });
        console.log(newArticle)
        //checking to make sure newArticle contains a storyUrl
        if (newArticle.storyUrl) {
            //checking if new article matches any saved article, 
            // if (!savedHeadlines.includes(newArticle.headline)) {
                newArticleArray.push(newArticle);
            // }
        }
    });

    //adding all new articles to database
    console.log(newArticleArray)
    db.Article
        .create(newArticleArray)
        .then(result => res.json({ count: newArticleArray.length }))//returning count of new articles to front end
        .catch(err => { });

    })

});

module.exports = router;