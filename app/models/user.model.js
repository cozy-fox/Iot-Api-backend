const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    email: String,
    allowed:{
      type:Boolean,
      required:true
    },
    password: {
      type: String,
      required:true
    },
    role: {
        type: String,
        required:true
      }
  })
);

module.exports = User;
