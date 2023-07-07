const db = require("../models");
Email=db.email;
exports.getData = async (req, res) => {
    try {
        let data= await Email.find();
        data=data.map(each=>{
            const newPassword='*'.repeat(each.password.length);
            return({password:newPassword, name:each.name, service:each.service, selected:each.selected, _id:each._id})
        })
        res.status(201).send(data);
    } catch (err) {
        res.status(401).send({ message: err.message });
    }
}


exports.createData = async (req, res) => {
    try {
        await Email.create(req.body);
        res.status(201).send({ message: "Created Sucessfully" });
    } catch (err) {
        res.status(401).send({ message: err.message });
    }
}

exports.deleteData = async (req, res) => {
    try {
        const result = await Email.deleteMany({ _id: { $in: req.body.selectedGroups } });
        res.status(200).send({ message: `${result.deletedCount} groups were deleted.` });
    } catch (err) {
        res.status(401).send({ message: err.message });
    }
}

exports.updateData = async (req, res) => {
    try {
        const result = await Email.findById(req.body.id);
        result.service=req.body.service;
        result.name=req.body.name;
        if(req.body.password!==''){
            result.password=req.body.password;
        }
        if(req.body.accountSelected){
            await Email.updateMany({selected:true}, {selected:false});
            result.selected=true;
        }
        await result.save();
        res.status(200).send({ message: `Updated Sucessfully` });
    } catch (err) {
        res.status(401).send({ message: err.message });
    }
}

