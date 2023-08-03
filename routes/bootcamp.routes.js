const { auth } = require("../middleware");
const bootcampController = require("../controllers/bootcamp.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/bootcamp",
    auth.verifyToken,
    bootcampController.createBootcamp
  );
  app.post(
    "/api/bootcamp/adduser",
    auth.verifyToken,
    bootcampController.addUser
  );
  app.get("/api/bootcamp/:id", auth.verifyToken, bootcampController.findById);
  app.get("/api/bootcamp", bootcampController.findAll);
};
