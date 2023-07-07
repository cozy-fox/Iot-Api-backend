const db = require("../models");
const emailSender=require("../utils/sendMail");

const Device=db.device;
const DeviceGroup=db.deviceGroup;
const User=db.user;



exports.getDeviceGroup = async (req, res) => {
    try {
        const userGroups = await DeviceGroup.find().populate("members", "name").populate("reference2user", "username");
        res.status(201).send(userGroups);
    } catch (err){
        res.status(401).send({ message: err.message });
    }
}

exports.createDeviceGroup = async (req, res) => {
    try {
        await DeviceGroup.create({ name: req.body.name });
        res.status(201).send({ message:`Group ${req.body.name} created Sucessfully` });
    } catch(err) {
        res.status(401).send({ message: err.message });
    }
}

exports.deleteGroup = async (req, res) => {
    try {
        const data=await DeviceGroup.find({ _id: { $in: req.body.selectedGroups } });
        for(eachDevice of data){
            for(each of eachDevice.members){
                const device=await Device.findById(each);
                await device.save();
            }
            for(each of eachDevice.reference2user){
                const user=await User.findById(each);
                user.group.pull(eachDevice._id);
                await user.save();
            }
        }
        const result = await DeviceGroup.deleteMany({ _id: { $in: req.body.selectedGroups } });
        res.status(200).send({ message: `${result.deletedCount} groups were deleted.` });
    } catch (err) {
        res.status(401).send({ message: err.message });
    }
}

exports.renameGroup = async (req, res) => {
    try {
        const result = await DeviceGroup.updateMany(
            { _id: { $in: req.body.selectedGroups } },
            { $set: { name: req.body.newName } }
        );
        res.status(201).send({ message: `${result.modifiedCount} groups renamed as ${req.body.newName}` });
    } catch (err) {
        res.status(401).send({ message: err.message });
    }
}

exports.updateGroup = async (req, res) => {
    try {
        const groupId = req.body.selected;
        const memberId = req.body.newMember;

        const group = await DeviceGroup.findById(groupId);
        const member = await (req.body.field == 'members'?Device:User).findById(memberId);

        if (!group || !member) {
            res.status(401).send({ message: "Invalid group Id or member Id" });
        }

        if (req.body.field == 'members') {
            if (req.body.value == 'add') {
                if(!group.members.includes(memberId)){
                    member.group=groupId;
                    group.members.push(memberId);
                }
            } else {
                member.group=null;
                group.members.pull(memberId);
            }
        } else {
            if (req.body.value == 'add') {
                if(!group.reference2user.includes(memberId)){
                    member.group.push(groupId);
                    group.reference2user.push(memberId);
                    emailSender.sendMail({
                        from: emailConfig.username,
                        to: member.email,
                        subject: 'Admin have Sucessfully added a Device Group '+group.name,
                        text: `Hi, ${member.username}.\n\n
                            Admin have Sucessfully added User Group ${group.name}.\n 
                            Consequently, you now possess the ability to monitor the devices included in this group.\n\n
                            Thank you`
                    });
                }
            } else {
                member.group.pull(groupId);
                group.reference2user.pull(memberId);
                emailSender.sendMail({
                    from: emailConfig.username,
                    to: member.email,
                    subject: 'Admin have Sucessfully removed a Device Group '+group.name,
                    text: `Hi, ${member.username}.\n\n
                        Admin have Sucessfully removed User Group ${group.name}.\n 
                        Unfortunately, you no longer possess the capability to monitor the devices associated with this group. I apologize for any inconvenience caused.\n\n
                        Thank you`
                });
            }
        }
        await member.save();
        await group.save();
        res.status(201).send({ message: `Added Sucessfully` });
    } catch (err) {
        res.status(401).send({ message: err.message });
    }
}

exports.get4select = async (req, res) => {
    try {
        const devices = await Device.find({},'name group');
        const users= await User.find({}, 'username');
        res.status(201).send({devices:devices, users:users});
    } catch (err){
        res.status(401).send({ message: err.message });
    }
}