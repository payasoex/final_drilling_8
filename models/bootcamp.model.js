module.exports = (sequelize, DataTypes) => {
  const Bootcamp = sequelize.define("bootcamp", {
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "El campo titulo (title) es requerido",
        },
      },
    },
    cue: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          args: true,
          msg: "Números de CUE es necesario, mínimo 5 y máximo 20",
        },
        isInt: {
          args: true,
          msg: "Debes introducir un número entero",
        },
        max: 20,
        min: 5,
      },
    },
    description: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "El campo descripción (description) es obligatorio",
        },
      },
    },
  });

  return Bootcamp;
};
