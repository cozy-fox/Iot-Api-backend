const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    allowed: {
      type: Boolean,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserGroup'
    }
  })
);

module.exports = User;
