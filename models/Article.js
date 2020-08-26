const mongoose = require("mongoose");

const ArticleSchema = mongoose.Schema({
  type: String,
  text: String,
  sign: String,
  origin: String,
});

module.exports = mongoose.model("Article", ArticleSchema);
