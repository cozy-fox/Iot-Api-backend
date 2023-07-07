const config = require("../config/auth.config");
const db = require("../models");
const crypto = require("crypto");
const User = db.user;
const Token = db.token;

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
    res.send({ message: "User was registered Sucessfully!" });
  } catch (err) {
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

    if (user.allowed == false) {
      return res.status(404).send({ message: "You are not allowed." });
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
    const user = await User.findById(req.userId).populate('group', 'name');
    res.status(200).send({ username: user.username, email: user.email, userGroup: user.group });
  } catch (err) {
    res.status(401).send({ message: err.message });
  }
}

exports.modifyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.username = req.body.username;
    user.email = req.body.email;
    if (user.password.length > 8) {
      user.password = bcrypt.hashSync(req.body.password, 8)
    }
    await user.save();
    res.status(200).send({ message: "Changed Sucessfully" });
  } catch (err) {
    res.status(401).send({ message: err.message });
  }
}

exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(401).send({ message: "This email is not registered email." });
    } else {
      
      let token = await Token.findOne({ userId: user._id });
      if (!token) {
        token = await Token.create({ userId: user._id, token: crypto.randomBytes(32).toString("hex") });
      }
      console.log(user._id + '/' + token.token);
      res.status(200).send({ message: "Sent Sucessfully." });
    }

  } catch (err) {
    res.status(401).send({ message: err.message });
  }
}

exports.resetPassword = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) {
      res.status(401).send({ message: "Invalid Link or Expired" });
    }
    const token = await Token.findOne({
      userId: user._id,
      token: req.body.token,
    });
    if (!token) return res.status(401).send({ message: "Invalid Link or Expired" });
    user.password = bcrypt.hashSync(req.body.password, 8);
    await user.save();
    await Token.deleteOne({userId: user._id});
    res.status(200).send({ message: "Reset Password Sucessfully" });
  } catch (err) {
    res.status(401).send({ message: err.message });
  }
}