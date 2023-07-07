const mongoose = require('mongoose');

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.userGroup=require("./userGroup.model");
db.device=require("./devices.model");
db.deviceGroup=require("./deviceGroup.model");
db.token=require("./token.model");
db.yggio=require("./yggioAccount.model");
db.email=require("./emailAccount.model");

module.exports = db;