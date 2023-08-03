const { verifySignUp, auth } = require("../middleware");
const userController = require("../controllers/user.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/signup",
    [verifySignUp.checkDuplicateEmail],
    userController.createUser
  );

  app.post("/api/signin", userController.signin);
  app.get("/api/user/:id", auth.verifyToken, userController.findUserById);
  app.get("/api/user/", auth.verifyToken, userController.findAll);
  app.put("/api/user/:id", auth.verifyToken, userController.updateUserById);
  app.delete("/api/user/:id", auth.verifyToken, userController.deleteUserById);
};
