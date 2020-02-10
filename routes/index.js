//Dependencies
var express = require('express');
var router = express.Router();
var db = require("../models");

//get route to root, populating index.handlebars with articles
router.get('/', (req,res) => {
  db.Article
    .find({})
    .then(articles => res.render('index', {articles}))
    .catch(err=> res.json(err));
});

module.exports = router;