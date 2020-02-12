//Dependencies
var router = require('express').Router();
//var router = requireexpress.Router();
var db = require("../models");

//get route to root, populating index.handlebars with articles
router.get('/', (req,res) => {
  console.log("index route")
  db.Article
    .find({})
    .then(articles => {
      console.log(articles)
     //res.json(articles)
    res.render('index', {items:articles})
    })
    .catch(err=> res.json(err));
});

module.exports = router;