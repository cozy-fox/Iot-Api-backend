const mongoose = require('mongoose');

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.userGroup=require("./userGroup.model");
db.device=require("./devices.model");
db.deviceGroup=require("./deviceGroup.model");

module.exports = db;