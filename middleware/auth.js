const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.users;

verifyToken = (req, res, next) => {
  let token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "Un token es requerido para la autorización",
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "No Autorizado...!",
      });
    }
    req.userId = decoded.id;
    next();
  });
};

const auth = {
  verifyToken: verifyToken,
};

module.exports = auth;
