const { authJwt } = require("../middlewares");
const userGroupController=require("../controllers/deviceGroup.controller");
const deviceController = require("../controllers/device.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/devices", [authJwt.verifyToken], deviceController.getDevice);

  app.post("/api/device_group", [authJwt.verifyToken, authJwt.isAdmin], userGroupController.createDeviceGroup);
  app.get("/api/device_group", [authJwt.verifyToken, authJwt.isAdmin], userGroupController.getDeviceGroup);
  app.delete("/api/device_group", [authJwt.verifyToken, authJwt.isAdmin], userGroupController.deleteGroup);
  app.put("/api/device_group/name", [authJwt.verifyToken, authJwt.isAdmin], userGroupController.renameGroup);
  app.put("/api/device_group", [authJwt.verifyToken, authJwt.isAdmin], userGroupController.updateGroup);

  app.get("/api/device_4select", [authJwt.verifyToken, authJwt.isAdmin], userGroupController.get4select);
};
