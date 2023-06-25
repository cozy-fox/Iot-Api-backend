const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/devices", [authJwt.verifyToken], controller.getDevice);

  app.get("/api/users", [authJwt.verifyToken, authJwt.isAdmin], controller.getUsers);
  app.delete("/api/users", [authJwt.verifyToken, authJwt.isAdmin], controller.deleteUsers);

};
