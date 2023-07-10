const axios = require('axios');

const db = require("../models");
const User = db.user;

exports.getAllUsers = async (req, res) => {
  const users = await User.find().populate('group', 'name');
  res.status(200).send(users);
}

exports.deleteUsers = async (req, res) => {
  try {
    const data=await User.find({ _id: { $in: req.body.selectedUsers } });
        for(eachDevice of data){
            for(each of eachDevice.group){
                const deviceGroup=await db.deviceGroup.findById(each);
                deviceGroup.reference2user.pull(eachDevice._id);
                await deviceGroup.save();
            }
        }
   const result = await User.deleteMany({ _id: { $in: req.body.selectedUsers } });
    res.status(200).send({ message: `${data.deletedCount} users were deleted.` });
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
