const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    role: 'user',
    allowed: false,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  try {
    await user.save();
    res.send({ message: "User was registered successfully!" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.body.username,
    });

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({ message: "Invalid Password!" });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });

    req.session.token = token;

    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      roles: user.role,
      token: token
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.signout = (req, res) => {
  req.session = null;
  res.status(200).send({ message: "You've been signed out!" });
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.status(200).send({ username: user.username, email: user.email });
  } catch {
    res.status(401).send({ message: err.message });
  }
}

exports.modifyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.username=req.body.username;
    user.email=req.body.email;
    if (user.password.length>8){
      user.password=bcrypt.hashSync(req.body.password, 8)
    }
    await user.save();
    res.status(200).send({message:"Changed Successfully" });
  } catch {
    res.status(401).send({ message: err.message });
  }
}