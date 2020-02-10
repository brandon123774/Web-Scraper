var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var articleSchema = new Schema({
  headline: {
    type: String,
    unique: true
  },
  summary: String,
  storyUrl: String,
  imgUrl: String,
  saved: {
    type: Boolean,
    default: false
  }
 
});

var Article = module.exports = mongoose.model('Article', articleSchema);