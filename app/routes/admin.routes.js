const { authJwt } = require("../middlewares");
const yggioController=require("../controllers/yggioAccount.controller");
const emailController=require("../controllers/emailAccount.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });


  app.get("/api/yggioAccount", [authJwt.verifyToken, authJwt.isAdmin], yggioController.getData);
  app.post("/api/yggioAccount", [authJwt.verifyToken, authJwt.isAdmin], yggioController.createData);
  app.delete("/api/yggioAccount", [authJwt.verifyToken, authJwt.isAdmin], yggioController.deleteData);
  app.put("/api/yggioAccount", [authJwt.verifyToken, authJwt.isAdmin], yggioController.updateData);

  app.get("/api/emailAccount", [authJwt.verifyToken, authJwt.isAdmin], emailController.getData);
  app.post("/api/emailAccount", [authJwt.verifyToken, authJwt.isAdmin], emailController.createData);
  app.delete("/api/emailAccount", [authJwt.verifyToken, authJwt.isAdmin], emailController.deleteData);
  app.put("/api/emailAccount", [authJwt.verifyToken, authJwt.isAdmin], emailController.updateData);
};
