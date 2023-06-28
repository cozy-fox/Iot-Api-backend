const mongoose = require("mongoose");

const User = mongoose.model(
  "Device",
  new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    yggioId: {
      type: String,
      required: true
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    group: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'deveicegroup'
    }],
    status: {
      type: String,
      required: true
    }
  })
);

module.exports = User;
