const db = require("../models");
const User = db.user;
const superUserEmail = require("./../config/basic.config").superUserEmail;

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
        const superUser = await User.findOne({ email: superUserEmail });

    if (req.body.selectedUsers.includes(superUser._id.toString())) {
      return res.status(401).send({ message: `You can't modify super user ${superUserEmail}.` });
    }

    if (req.body.selectedUsers.includes(req.userId)) {
      return res.status(401).send({ message: `You can't modify your account.` });
    }

    if (req.body.field === "role" && req.body.value === "user") {
      const admins = await User.find({ role: "admin" });
      if (admins.length === 1) {
        return res.status(401).send({ message: `This is unique admin. You can't set it as user` });
      }
    }
    const result = await User.updateMany({ _id: { $in: req.body.selectedUsers } },
      { $set: { [req.body.field]: value } });
    res.status(200).send({ message: `${result.modifiedCount} users "${req.body.field}" set as ${req.body.value}.` });
  } catch (err) {
    res.status(401).send({ message: err.message });
  }
}
