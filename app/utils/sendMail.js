const emailConfig = require('../config/email.config');
const nodemailer = require('nodemailer');
const db = require("../models");


exports.sendMail = async (mail) => {
    try {
        const emailAccount=await db.email.findOne({selected:true});
        let config={
            service: emailConfig.service,
            auth: {
                user: emailConfig.username,
                pass: emailConfig.password
            }
        }
        if(emailAccount){
            config={
                service: emailAccount.service,
                auth: {
                    user: emailAccount.name,
                    pass: emailAccount.password
                }
            }
        }
        const transporter = await nodemailer.createTransport(config);
        await transporter.sendMail({...mail,from:config.auth.user},function (error, info) {
            if (error) {
                console.log('Error:', error);
            } else {
                console.log('Email sent');
            }
        });
    } catch (err) {
      res.status(401).send({ message: err.message });
    }
  }