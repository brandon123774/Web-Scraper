//dependencies
var express = require ("express");
var handlebars = require ("express-handlebars");
var mongoose = require ("mongoose");
var logger = require ("morgan");

//web scraping tools
var axios = require ("axios");
var cheerio = require ("cheerio");

//initialize the application
var app = express();

//db for models
var config = require ("./config/db");
mongoose.Promise = Promise;
mongoose
  .connect(config.database, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then( result => {
    console.log(`Database Connected: '${result.connections[0].name}' on ${result.connections[0].host}:${result.connections[0].port}`);
  })
  .catch(err => console.log('Connection error:', err));

//morgan setup 
app.use(logger('dev'));

//setting up handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//port for localhost
var PORT = 3000;

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));

//routes
var index = require("./routes/index");
var articles = require("./routes/articles");
var scrape = require("./routes/scrape");

app.use("/", index);
app.use("/articles", articles);
app.use("/scrape", scrape);

// initiate server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });