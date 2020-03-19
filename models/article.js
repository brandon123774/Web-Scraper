var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var articleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  summary: {
    type: String,
  },
  link: {
    type: String,
    required: true
  },
  image: {
    type: String,
  },
  saved: {
    type: Boolean,
    default: false
    
    // summary: String,
    // storyUrl: String,
    // imgUrl: String,
    // saved: {
    //   type: Boolean,
    //   default: false
    // }
  }
});
articleSchema.index({
  link: 1,
},  {
  unique: true,
});

var Article = mongoose.model('Article', articleSchema);

module.exports = Article;