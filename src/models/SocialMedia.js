const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>{
    sequelize.define('SocialMedia',{
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true, //incrementa en 1 el id de la siguiente red social agregada
            allowNull: false,
            primaryKey: true
          },
        name:{
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                  msg: 'El nombre de la red social no puede estar vacío.'
                },
              }
        },
        // icon:{
        //     type: DataTypes.STRING,
        //     allowNull: false,
        // },   
    }, {timestamps: false});
}