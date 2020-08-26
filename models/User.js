const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  email: String,
  hash: String,
  type: String,
});

module.exports = mongoose.model("User", UserSchema);
