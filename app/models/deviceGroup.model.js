const mongoose = require("mongoose");

const YggioAuthen = mongoose.model(
  "YggioAuthen",
  new mongoose.Schema({
    name: {
      type: String
    },
    members: [String]
  })
);

module.exports = YggioAuthen;
