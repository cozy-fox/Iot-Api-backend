const mongoose = require("mongoose");

const YggioAuthen = mongoose.model(
  "YggioAuthen",
  new mongoose.Schema({
    username: String,
    password: String,
    selected: Boolean
  })
);

module.exports = YggioAuthen;
