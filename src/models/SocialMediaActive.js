const { DataTypes, where } = require("sequelize");

module.exports = (sequelize) => {
  const SocialMediaActive = sequelize.define(
    "SocialMediaActive",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      dataUser: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      socialMediaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      accessToken: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      refreshToken: {
        //este actualiza el access token cuando expira cada 6hs
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      authorizationCode: {
        //este code se obtiene post autenticacion, se usa para obtener el access token
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      expirationDate: {
        // almacenamos la fecha de expiración del token
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      userId: {
        //userId para meli
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      //datos para respuesta automatica
      automaticResponse: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {
          active: false,
          detail: [
            { day: 0, startHour: null, endHour: null, message: "" },
            { day: 1, startHour: null, endHour: null, message: "" },
            { day: 2, startHour: null, endHour: null, message: "" },
            { day: 3, startHour: null, endHour: null, message: "" },
            { day: 4, startHour: null, endHour: null, message: "" },
            { day: 5, startHour: null, endHour: null, message: "" },
            { day: 6, startHour: null, endHour: null, message: "" },
          ],
        },
      },
    },
    { timestamps: false }
  );

  SocialMediaActive.updateSocialMediaActive = async function () {
    await this.update(
      {
        automaticResponse: {
          active: false,
          detail: [
            { day: 0, startHour: null, endHour: null, message: "" },
            { day: 1, startHour: null, endHour: null, message: "" },
            { day: 2, startHour: null, endHour: null, message: "" },
            { day: 3, startHour: null, endHour: null, message: "" },
            { day: 4, startHour: null, endHour: null, message: "" },
            { day: 5, startHour: null, endHour: null, message: "" },
            { day: 6, startHour: null, endHour: null, message: "" },
          ],
        },
      },
      { where: { automaticResponse: null } }
    );
  };
  return SocialMediaActive;
};
