const axios = require('axios');

const db = require("../models");
const User = db.user;

exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  res.status(200).send(users);
}

exports.deleteUsers = async (req, res) => {
  try {
    const result = await User.deleteMany({ _id: { $in: req.body.selectedUsers } });
    res.status(200).send({ message: `${result.deletedCount} users were deleted.` });
  } catch (err) {
    res.status(401).send({ message: err.message });
  }
}

exports.updateUsers = async (req, res) => {
  try {
    const value = req.body.field == "allowed" ? req.body.value == "true" : req.body.value;
    const result = await User.updateMany({ _id: { $in: req.body.selectedUsers } },
      { $set: { [req.body.field]: value } });
    res.status(200).send({ message: `${result.modifiedCount} users "${req.body.field}" set as ${req.body.value}.` });
  } catch (err) {
    res.status(401).send({ message: err.message });
  }
}
