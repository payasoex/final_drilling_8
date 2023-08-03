const { users, bootcamps } = require("../models");
const db = require("../models");
const Bootcamp = db.bootcamps;
const User = db.users;
const config = require("../config/auth.config");
const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

// Crear y guardar un nuevo bootcamp
exports.createBootcamp = (req, res) => {
  if (!req.body.title || !req.body.cue || !req.body.description) {
    res.status(400).send({
      message: "Todos los campos son requeridos",
    });
    return;
  }

  //crear el bootcamp
  return Bootcamp.create({
    title: req.body.title,
    cue: req.body.cue,
    description: req.body.description,
  })
    .then((bootcamp) => {
      if (bootcamp) {
        console.log(
          `>> Creado el bootcamp: ${JSON.stringify(bootcamp, null, 4)}`
        );
        return res.send(bootcamp);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Ha ocurrido un error en la creación del bootcamp.",
      });
    });
};

// Agregar un Usuario al Bootcamp
exports.addUser = (req, res) => {
  const idBootcamp = req.body.idBootcamp;
  const idUser = req.body.idUser;

  return Bootcamp.findByPk(idBootcamp)
    .then((bootcamp) => {
      if (!bootcamp) {
        console.log("No se encontró el Bootcamp!");
        return null;
      }
      return User.findByPk(idUser).then((user) => {
        if (!user) {
          console.log("Usuario no encontrado!");
          return res.send("Usuario no encontrado!");
        }
        bootcamp.addUser(user);
        console.log("***************************");
        console.log(
          ` Agregado el usuario id=${user.id} al bootcamp con id=${bootcamp.id}`
        );
        console.log("***************************");
        return res.send(bootcamp);
      });
    })
    .catch((err) => {
      console.log(
        ">> Error mientras se estaba agregando Usuario al Bootcamp",
        err
      );
    });
};

// obtener los bootcamp por id
exports.findById = (req, res) => {
  return Bootcamp.findByPk(req.params.id, {
    include: [
      {
        model: User,
        as: "users",
        attributes: ["id", "firstName", "lastName", "email"],
        through: {
          attributes: [],
        },
      },
    ],
  })
    .then((bootcamp) => {
      if (bootcamp) {
        return res.send(bootcamp);
      } else {
        res.status(404).send({
          message: "Ha ocurrido un error buscando el bootcamp.",
        });
      }
    })
    .catch((err) => {
      console.log(`>> Error buscando el bootcamp: ${err}`);
    });
};

// obtener todos los bootcamp sin los usuarios
exports.findAll = (req, res) => {
  return Bootcamp.findAll({})
    .then((bootcamp) => {
      return res.send(bootcamp);
    })
    .catch((err) => {
      res.status(404).send({
        message: "Error Buscando los Bootcamps: ",
      });
    });
};
