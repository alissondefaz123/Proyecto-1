const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Usuario = sequelize.define(
    "Usuario",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "El nombre es obligatorio"
                }
            }
        },

        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: {
                    msg: "El usuario es obligatorio"
                }
            }
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "La contraseña es obligatoria"
                }
            }
        },

        rol: {
            type: DataTypes.ENUM("ADMIN", "ANALISTA"),
            allowNull: false,
            defaultValue: "ANALISTA"
        }
    },
    {
        tableName: "usuarios",
        timestamps: true
    }
);

module.exports = Usuario;
