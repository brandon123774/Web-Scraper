//Dependencies
var express = require('express');
var cheerio = require('cheerio');
var router = express.Router();
var db = require('../models');

//route to scrape new articles
router.get("/newArticles", function (req, res) {
    //options
    var options = {
        uri: 'https://slate.com/technology',
        transform: function (body) {
            return cheerio.load(body);
        }
    };
    //calling the db to return articles
    db.Article
        .find({})
        .then((savedArticles) => {
            //creating an array of saved article headlines
            var savedHeadlines = savedArticles.map(article => article.headline);

            //iterating over returned articles, and creating a newArticle object from the data
            $('#stream-panel li').each((i, element) => {
                let newArticle = new db.Article({
                    storyUrl: `https://www.slate.com${$(element).find('a').attr('href')}`,
                    headline: $(element).find('h2').text().trim(),
                    summary: $(element).find('p').text().trim(),
                    imgUrl: $(element).find('img').attr('src'),
                });
                //checking to make sure newArticle contains a storyUrl
                if (newArticle.storyUrl) {
                    //checking if new article matches any saved article, 
                    if (!savedHeadlines.includes(newArticle.headline)) {
                        newArticleArr.push(newArticle);
                    }
                }
            });

            //adding all new articles to database
            db.Article
                .create(newArticleArray)
                .then(result => res.json({ count: newArticleArray.length }))//returning count of new articles to front end
                .catch(err => { });
        })

    .catch(err => console.log(err)); 
});

module.exports = router;