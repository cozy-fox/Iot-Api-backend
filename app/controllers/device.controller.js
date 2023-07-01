const axios = require('axios');
var token = "";

const db = require("../models");
const yggioConfig = require('../config/yggio.config');
const Device = db.device;

async function getYggioToken() {
    await axios.post(yggioConfig.server + "/auth/local", {
        'username': yggioConfig.username,
        "password": yggioConfig.password
    })
        .then(response => {
            if (response.data.token) {
                token = response.data.token;
            }
        });
}

async function getDeviceFromAggio(req, res) {
    await axios.get(yggioConfig.server + '/iotnodes', { headers: { Authorization: 'Bearer ' + token } })
        .then(async (response) => {
            var devicesids = await Device.find({}, 'yggioId');
            // console.log(devicesids);
            devicesids = devicesids.map(each => each.yggioId);
            // console.log(devicesids);
            for (each of response.data) {
                // console.log('each',each._id);
                await Device.updateOne({ yggioId: each._id }, { $set: { status: 'available' } });
                devicesids = await devicesids.filter(item => item !== each._id);
                const device = await Device.findOne({ yggioId: each._id });
                if (device == null) {
                    // console.log('null')
                    await Device.create({ name: each.name, yggioId: each._id, data: each, status: 'available' });
                } else if (device.data != each) {
                    // console.log('update')
                    await Device.updateOne({ yggioId: each._id }, { $set: { name: each.name, data: each } });
                }
            }
            // console.log('finish',devicesids);
            for (each of devicesids) {
                await Device.updateOne({ yggioId: each }, { $set: { status: 'offline' } })
            }
        })
        .catch(async error => {
            if (error.response && error.response.data == ("Invalid authorization token" || "Token expired")) {
                await getYggioToken();
            } else {
                console.log("Yggio connection Error");
            }
        });
    setTimeout(getDeviceFromAggio, 1000 * yggioConfig.sendRequestPeriod);
}

exports.getDeviceFromAggio = getDeviceFromAggio;

exports.getDevice = async (req, res) => {
    try {
        const user = await db.user.findById(req.userId);
        var result = [];
        if (user.role == 'admin') {
            result = await Device.find().populate('group', 'name');
        } else {
            for (const devicegroupid of user.group) {
                const devicegroup = await db.deviceGroup.findById(devicegroupid);
                for (const deviceid of devicegroup.members) {
                    const device = await db.device.findById(deviceid).populate('group', 'name');
                    var flag = false;
                    for (const each of result) {
                        if (each._id == device._id) { flag = true; break; }
                    }
                    if (flag) {
                        continue;
                    } else {
                        result.push(device);
                    }
                }
            }
        }
        res.status(200).send(result);
    } catch (error) {
        res.status(401).send({ message: error.message });
    }

}