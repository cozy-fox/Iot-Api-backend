const axios=require('axios');
var token="";

const db = require("../models");
const API_URL = 'https://yggio3-beta.sensative.net/api';
const User = db.user;

async function getYggioToken(){
  await axios.post(API_URL + "/auth/local", {
        'username':'GFE_Lifefinder',
        "password": 'skl83r#opsf8yw3'
      })
      .then(response => {
        if (response.data.token) {
          token=response.data.token;
        }
      });
}

exports.getDevice=async (req,res)=>{  
  if(token==""){
    await getYggioToken();
  }
  res.status(200).send(token);
}

exports.getUsers=async (req,res)=>{
  const users=await User.find();
  res.status(200).send(users);
}

exports.deleteUsers=async (req,res)=>{
  try {
    const result = await User.deleteMany({ _id: { $in: req.body.selectedUsers } });
    res.status(200).send({message:`${result.deletedCount} documents were deleted.`});
  } catch (err) {
    res.status(401).send({ message:err.message });
  }
}

exports.updateUsers=async (req,res)=>{
  try {
    const value=req.body.field=="allowed"?req.body.value=="true":req.body.value;
    const result = await User.updateMany({ _id: { $in: req.body.selectedUsers } },
      {$set:{[req.body.field]:value}});
    res.status(200).send({message:`${result.modifiedCount} documents "${req.body.field}" set as ${req.body.value}.`});
  } catch (err) {
    res.status(401).send({ message:err.message });
  }
}