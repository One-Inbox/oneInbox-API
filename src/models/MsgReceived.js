const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const MsgReceived = sequelize.define(
    "MsgReceived",
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      chatId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      //chequear con Insta, face y Meli como registran el contacto
      idUser: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      text: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      timestamp: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      //item agregado que guarda el id del mensaje en la plataforma de origen, para que no se pisen los mensajes
      // en el inicio tendran un identificador de red social: MELI- TL- IG - WSP - FB
      externalId: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },

      phoneNumber: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: null,
      },
      //userName se tiene que llamar productId
      userName: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      Email: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      BusinessId: {
        type: DataTypes.UUID,
        allowNull: true,
      },

      state: {
        type: DataTypes.ENUM,
        //hay que cambiar el front para usar los values en Ingles
        values: ["No Leidos", "Leidos", "Respondidos", "Archivados"],
        defaultValue: "No Leidos",
        // values: ['New', 'Read', 'Answered', 'Archived'],
        // defaultValue: "New",
        allowNull: false,
      },
      received: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      processed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false, // por defecto esta en false y se deberia actualizar a true cuando se procese y guarde el msj
      },
    },
    { timestamps: false }
  );

  MsgReceived.updateDefaultText = async function () {
    await this.update(
      { text: "default text" }, // Proporcionar un valor predeterminado significativo
      { where: { text: null } }
    );
  };

  return MsgReceived;
};
