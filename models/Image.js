const mongoose = require("mongoose");

const ImageSchema = mongoose.Schema({
  public_id: String,
  url: String,
  description: String,
  year: Number,
  category: Number,
  isHighlighted: Boolean,
});

module.exports = mongoose.model("Image", ImageSchema);
