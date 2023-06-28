const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const userGroupController=require("../controllers/userGroup.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/users", [authJwt.verifyToken, authJwt.isAdmin], controller.getAllUsers);
  app.delete("/api/users", [authJwt.verifyToken, authJwt.isAdmin], controller.deleteUsers);
  app.put("/api/users", [authJwt.verifyToken, authJwt.isAdmin], controller.updateUsers);

  app.post("/api/user_group", [authJwt.verifyToken, authJwt.isAdmin], userGroupController.createUserGroup);
  app.get("/api/user_group", [authJwt.verifyToken, authJwt.isAdmin], userGroupController.getUserGroup);
  app.delete("/api/user_group", [authJwt.verifyToken, authJwt.isAdmin], userGroupController.deleteUserGroup);
  app.put("/api/user_group/name", [authJwt.verifyToken, authJwt.isAdmin], userGroupController.renameUserGroup);
  app.put("/api/user_group", [authJwt.verifyToken, authJwt.isAdmin], userGroupController.updateUserGroup);

  app.get("/api/user_4select", [authJwt.verifyToken, authJwt.isAdmin], userGroupController.get4select);
};
