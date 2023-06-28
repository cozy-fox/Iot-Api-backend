const axios = require('axios');

const db = require("../models");
const User = db.user;
const UserGroup = db.userGroup;
const DeviceGroup = db.deviceGroup;

exports.getUserGroup = async (req, res) => {
    try {
        const userGroups = await UserGroup.find().populate("members", "username").populate("reference2devicegroup", "name");
        res.status(201).send(userGroups);
    } catch {
        res.status(401).send({ message: err.message });
    }
}

exports.createUserGroup = async (req, res) => {
    try {
        await UserGroup.create({ name: req.body.name });
        res.status(201).send({ message: "UserGroup created successfully" });
    } catch {
        res.status(401).send({ message: err.message });
    }
}

exports.deleteUserGroup = async (req, res) => {
    try {
        const result = await UserGroup.deleteMany({ _id: { $in: req.body.selectedGroups } });
        res.status(200).send({ message: `${result.deletedCount} groups were deleted.` });
    } catch (err) {
        res.status(401).send({ message: err.message });
    }
}

exports.renameUserGroup = async (req, res) => {
    try {
        const result = await UserGroup.updateMany(
            { _id: { $in: req.body.selectedGroups } },
            { $set: { name: req.body.newName } }
        );
        res.status(201).send({ message: `${result.modifiedCount} groups renamed as ${req.body.newName}` });
    } catch (err) {
        res.status(401).send({ message: err.message });
    }
}

exports.updateUserGroup = async (req, res) => {
    try {
        const groupId = req.body.selected;
        const memberId = req.body.newMember;

        const group = await UserGroup.findById(groupId);
        const member = await (req.body.field == 'members'?User:DeviceGroup).findById(memberId);

        if (!group || !member) {
            res.status(401).send({ message: "Invalid group Id or member Id" });
        }

        if (req.body.field == 'members') {
            if (req.body.value == 'add') {
                group.members.includes(memberId)?'':group.members.push(memberId);
            } else {
                group.members.pull(memberId);
            }
        } else {
            if (req.body.value == 'add') {
                group.reference2devicegroup.includes(memberId)?'':group.reference2devicegroup.push(memberId);
            } else {
                group.reference2devicegroup.pull(memberId);
            }
        }

        await group.save();
        res.status(201).send({ message: `Added successfully` });
    } catch (err) {
        res.status(401).send({ message: err.message });
    }
}

exports.get4select = async (req, res) => {
    try {
        const users = await User.find({},'username');
        const devices= await DeviceGroup.find({}, 'name');
        res.status(201).send({users:users, devices:devices});
    } catch {
        res.status(401).send({ message: err.message });
    }
}