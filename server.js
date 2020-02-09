//dependencies
var express = require ("express");
var handlebars = require ("express-handlebars");
var mongoose = require ("mongoose");

//web scraping tools
var axios = require ("axios");
var cheerio = require ("cheerio");

//db for models
var db = require ("./models");

//port for localhost
var PORT = 3000;

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));

// initiate server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });