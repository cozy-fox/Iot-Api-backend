const mongoose = require("mongoose");

const YggioAuthen = mongoose.model(
  "deveicegroup",
  new mongoose.Schema({
    name: {
      type: String
    },
    members: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Device'
    }],
    reference2usergroup:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserGroup'
    }]
  })
);

module.exports = YggioAuthen;
