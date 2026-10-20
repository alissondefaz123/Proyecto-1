const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Incidente = sequelize.define(
    "Incidente",
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },

        tipo: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "El tipo de incidente es obligatorio"
                },
                len: {
                    args: [3, 100],
                    msg: "El tipo debe tener entre 3 y 100 caracteres"
                }
            }
        },

        severidad: {
            type: DataTypes.ENUM(
                "Baja",
                "Media",
                "Alta",
                "Crítica"
            ),
            allowNull: false,
            validate: {
                isIn: {
                    args: [["Baja", "Media", "Alta", "Crítica"]],
                    msg: "La severidad no es válida"
                }
            }
        },

        estado: {
            type: DataTypes.ENUM(
                "Abierto",
                "En análisis",
                "Resuelto"
            ),
            allowNull: false,
            defaultValue: "Abierto",
            validate: {
                isIn: {
                    args: [["Abierto", "En análisis", "Resuelto"]],
                    msg: "El estado no es válido"
                }
            }
        },

        fecha: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            validate: {
                isDate: {
                    msg: "La fecha no es válida"
                }
            }
        },

        responsable: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "El responsable es obligatorio"
                },
                len: {
                    args: [3, 100],
                    msg: "El responsable debe tener entre 3 y 100 caracteres"
                }
            }
        },

        descripcion: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        tableName: "incidentes",
        timestamps: true
    }
);

module.exports = Incidente;
