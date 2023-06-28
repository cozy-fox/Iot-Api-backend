const mongoose = require("mongoose");

const User = mongoose.model(
    "UserGroup",
    new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        members: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        reference2devicegroup:[{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'deveicegroup'
        }]

    })
);

module.exports = User;
