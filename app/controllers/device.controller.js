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

async function getDevice(req, res) {
    axios.get(API_URL + '/iotnodes', { headers: { Authorization: 'Bearer ' + token } })
        .then((response) => {
            response.data.forEach(async (each) => {
                const device = await Device.findOne({ yggioId: each._id });
                if(device==null){
                    await Device.create({name:each.name, yggioId:each._id, data:each});
                }else if(device.data!=each){
                    await Device.updateOne({yggioId:each._id}, {name:each.name, data:each});
                }
            });
        }).catch(error => {
            if (error.response && error.response.data == ("Invalid authorization token"||"Token expired")) {
                getYggioToken();
            }else{
                console.log(error);
            }
        });
    setTimeout(getDevice, 1000);
}

exports.getDevice = getDevice;

exports.getDevice4Admin= async (req, res) => {
    const users = await Device.find();
    res.status(200).send(users);
}