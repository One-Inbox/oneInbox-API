const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "El nombre del usuario no puede estar vacío.",
          },
          len: {
            args: [3, 100],
            msg: "El nombre del usuario debe tener entre 3 y 100 caracteres.",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      privilege: {
        type: DataTypes.ENUM("Admin", "Member"),
        allowNull: false,
      },
      socketId: {
        type: DataTypes.STRING,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      //Archivar user
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
      //fecha de alta
      admissionDate: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      //fecha de baja
      dischargeDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      // //numero de legajo
      // fileNumber: {
      //   type: DataTypes.STRING,
      //   allowNull: true,
      //   defaultValue: null,
      // },
    },
    { timestamps: false }
  );
  User.updateUser = async function () {
    await this.update(
      { admissionDate: new Date() },
      { where: { admissionDate: null } }
    );
  };
  return User;
};
