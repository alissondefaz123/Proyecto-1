
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
                },
                len: {
                    args: [1, 100],
                    msg: "El nombre debe tener entre 1 y 100 caracteres"
                }
            }
        },

        username: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: {
                    msg: "El usuario es obligatorio"
                },
                len: {
                    args: [3, 30],
                    msg: "El usuario debe tener entre 3 y 30 caracteres"
                },
                is: {
                    args: /^[a-zA-Z0-9_.-]+$/,
                    msg: "El usuario contiene caracteres no permitidos"
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
