//Dependencies
var express = require('express');
var router = express.Router();
var db = require("../models");
var axios = require("axios");
var cheerio = require('cheerio');

//get route to root, populating index.handlebars with articles
router.get('/', (req, res) => {
    console.log("index route")
    db.Article
        .find({})
        .then(articles => {

            //console.log(articles)
            //res.json(articles)

            let array = []
            console.log("length:", articles.length)
            let arrayArticles = articles.map(elem=>{
                return {
                    id: elem._id,
                    title: elem.title,
                    link: elem.link,
                    saved: elem.saved
                }
            })
            console.log(articles)
            res.render('index', { items: arrayArticles })
        })
        .catch(err => console.log(err));
});

//get route to root, populating index.handlebars with articles
router.get('/saved', (req, res) => {
    console.log("index route")
    db.Article
        .find({})
        .then(articles => {

            //console.log(articles)
            //res.json(articles)

            let array = []
            console.log("length:", articles.length)
            
            let arrayArticles = articles.map(elem=>{
                return {
                    id: elem._id,
                    title: elem.title,
                    link: elem.link,
                    saved: elem.saved
                }
            })
            console.log(articles)
            res.render('saved', { items: arrayArticles })
        })
        .catch(err => console.log(err));
});

//get route to root, populating index.handlebars with articles
router.get('/test', (req, res) => {
    console.log("index route")
    db.Article
        .find({})
        .then(articles => {

            console.log(articles)
            res.json(articles)
            // res.render('index', { items: articles })
        })
        .catch(err => res.json(err));
});
//get route to update
router.put('/articles/save/:id', (req, res) => {
    console.log("article route")
    db.Article
        .updateOne({ _id: req.params.id }, { saved: true })
        .then(result => res.json(result))
        .catch(err => res.json(err));
});

//route to scrape new articles
router.get("/scrape", function (req, res) {
    //options
    console.log("scrape route")
    var options = {
        uri: 'https://slate.com/technology',
        transform: function (body) {
            return cheerio.load(body);
        }
    };
    axios.get(options.uri).then(function (response) {
        // console.log(response.data)
        var $ = cheerio.load(response.data)

        var newArticleArray = []

        //iterating over returned articles, and creating a newArticle object from the data
        $('.topic-story').each((i, element) => {
            //console.log(element)
            console.log("--->", $(element).find('img').attr('data-src'))
            var newArticle = new db.Article({
                link: $(element).attr("href"),
                storyUrl: `https://www.slate.com${$(element).find('a').attr('href')}`,
                title: $(element).find('.topic-story__hed').text().trim(),
                summary: $(element).find('p').text().trim(),
                imgUrl: $(element).find('img').attr('data-src'),
            });
            console.log(newArticle)
            
            //checking to make sure newArticle contains a storyUrl
            if (newArticle.link) {
                newArticleArray.push(newArticle);
                
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