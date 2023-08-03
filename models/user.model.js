module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("users", {
    firstName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "El campo nombre es obligatorio",
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "El campo apellido es obligatorio",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "el email es requerido",
        },
        isEmail: {
          args: true,
          msg: "Formato de correo invalido",
        },
      },
      unique: {
        args: true,
        msg: "Este email ya se encuentra registrado en la base de datos",
      },
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "el password debe tener 8 caracteres como mínimo",
        },
        min: 8,
      },
    },
  });

  return User;
};
