const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

verifyToken = (req, res, next) => {
  console.log('verify token',req.body);

  let token = req.headers['token'];
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token.slice(7), config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = async (req, res, next) => {
  console.log('admin check',req.body);
  try {
    const user = await User.findById(req.userId).exec();
    if (user.role === 'admin') {
        next();
    } else {
        res.status(403).send({ message: 'Require Admin Role!' });
    }
} catch (err) {
    res.status(500).send({ message: err });
}
};


const authJwt = {
  verifyToken,
  isAdmin,
};
module.exports = authJwt;
