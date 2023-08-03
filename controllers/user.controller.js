const { users } = require("../models");
const db = require("../models");
const User = db.users;
const Bootcamp = db.bootcamps;
const config = require("../config/auth.config");
const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.createUser = (req, res) => {
  // Validar el request
  if (
    !req.body.firstName ||
    !req.body.lastName ||
    !req.body.email ||
    !req.body.password
  ) {
    res.status(400).send({
      message: "Todos los campos son requeridos",
    });
    return;
  }

  // Crear un usuario
  const user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password),
  };

  // Guardando un usuario en la base de datos
  User.create(user)
    .then((data) => {
      res.send(data);
      //res.send("usuario Registrado satisfactoriamente")
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Ha ocurrido un error creando el usuario.",
      });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "Usuario no registrado.",
        });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Password inválido!",
        });
      }

      var token = jwt.sign(
        {
          id: user.id,
        },
        config.secret,
        {
          expiresIn: 86400, // 24 hours
        }
      );

      res.status(200).send({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        accessToken: token,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

// obtener los bootcamp de un usuario
exports.findUserById = (req, res) => {
  User.findByPk(req.params.id, {
    include: [
      {
        model: Bootcamp,
        as: "bootcamps",
        attributes: ["id", "title"],
        through: {
          attributes: [],
        },
      },
    ],
  })
    .then((user) => {
      if (user) {
        return res.send(user);
      } else {
        res.status(404).send({
          message: "Ha ocurrido un error mientras se buscaba al usuario.",
        });
      }
    })
    .catch((err) => {
      res.send({
        message: err.message,
      });
    });
};

// obtener todos los Usuarios incluyendo los bootcamp
exports.findAll = (req, res) => {
  return User.findAll({
    include: [
      {
        model: Bootcamp,
        as: "bootcamps",
        attributes: ["id", "title"],
        through: {
          attributes: [],
        },
      },
    ],
  })
    .then((user) => {
      return res.send(user);
    })
    .catch((err) => {
      res.status(404).send({
        message:
          err.message ||
          "Ha ocurrido un error mientras se buscaba al usuario.",
      });
    });
};

// Actualizar usuarios
exports.updateUserById = (req, res) => {
  const userId = req.params.id;
  return User.update(
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    },
    {
      where: {
        id: userId,
      },
    }
  )
    .then((update) => {
      if (update == 1) {
        res.send({
          message: "El usuario ha sido actualizado.",
        });
      } else {
        res.send({
          message: `No se puede actualizar el usuario=${userId}. No se puede encontrar el usuario o req.body es vacío!`,
        });
      }
    })

    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Ha ocurrido un error mientras se actualizaba el usuario.",
      });
    });
};

// Eliminar un usuario
exports.deleteUserById = (req, res) => {
  const userId = req.params.id;
  return User.destroy({
    where: {
      id: userId,
    },
  })
    .then((user) => {
      console.log(
        `>> Se ha eliminado el usuario: ${JSON.stringify(user, null, 4)}`
      );
      return res.send(`Se ha eliminado el usuario: ${JSON.stringify(user, null, 4)}`);
    })
    .catch((err) => {
      res.status(500).send({
        message: `Error mientras se eliminaba el usuario: ${err}`,
      });
    });
};
