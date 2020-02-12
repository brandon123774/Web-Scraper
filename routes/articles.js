//Dependencies
var express = require('express');
var router = express.Router();
var db = require("../models");

//get route to update
router.get('/save/:id', (req,res) => {
  console.log("article route")
  db.Article
    .update({_id: req.params.id},{saved: true})
    .then(result=> res.redirect('/'))
    .catch(err => res.json(err));
});

module.exports = router;