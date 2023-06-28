const axios = require('axios');
var token = "";

const db = require("../models");
const API_URL = 'https://yggio3-beta.sensative.net/api';
const Device = db.device;

async function getYggioToken() {
    await axios.post(API_URL + "/auth/local", {
        'username': 'GFE_Lifefinder',
        "password": 'skl83r#opsf8yw3'
    })
        .then(response => {
            if (response.data.token) {
                token = response.data.token;
            }
        });
}

async function getDeviceFromAggio(req, res) {
    axios.get(API_URL + '/iotnodes', { headers: { Authorization: 'Bearer ' + token } })
        .then(async (response) => {
            var devicesids = await Device.find({}, 'yggioId');
            
            devicesids = devicesids.map(each => each.yggioId);
            for(each of response.data){
                await Device.updateOne({ yggioId: each._id }, { status: 'available' });   
                devicesids=devicesids.filter(item => item !== each._id);
                const device = await Device.findOne({ yggioId: each._id });
                if (device == null) {
                    await Device.create({ name: each.name, yggioId: each._id, data: each, status: 'available' });
                } else if (device.data != each) {
                    await Device.updateOne({ yggioId: each._id }, { name: each.name, data: each });
                }
            }   
            for (each of devicesids) {
                await Device.updateOne({ yggioId: each }, { status: 'offline' })
            }
        }).catch(error => {
            if (error.response && error.response.data == ("Invalid authorization token" || "Token expired")) {
                getYggioToken();
            } else {
                console.log(error);
            }
        });
    setTimeout(getDeviceFromAggio, 1000);
}

exports.getDeviceFromAggio = getDeviceFromAggio;

exports.getDevice = async (req, res) => {
    try {
        const user = await db.user.findById(req.userId);
        var result = [];
        if (user.role == 'admin') {
            result = await Device.find();
        } else {
            for (const usergroupid of user.group) {
                const usergroup = await db.userGroup.findById(usergroupid);
                for (const devicegroupid of usergroup.reference2devicegroup) {
                    const devicegroup = await db.deviceGroup.findById(devicegroupid);
                    for (const deviceid of devicegroup.members) {
                        const device = await db.device.findById(deviceid);
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
        }
        res.status(200).send(result);
    } catch (error) {
        res.status(401).send({ message: error.message });
    }

}