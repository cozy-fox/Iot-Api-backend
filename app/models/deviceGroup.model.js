const mongoose = require("mongoose");

const YggioAuthen = mongoose.model(
  "devicegroup",
  new mongoose.Schema({
    name: {
      type: String
    },
    members: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Device'
    }],
    reference2user:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  })
);

module.exports = YggioAuthen;
