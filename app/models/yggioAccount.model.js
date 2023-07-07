const mongoose = require("mongoose");

const User = mongoose.model(
  "Yggio",
  new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    selected :{
      type: Boolean,
      default : false
    }
  })
);

module.exports = User;
