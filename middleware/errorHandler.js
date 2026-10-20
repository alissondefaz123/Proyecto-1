const {
    ValidationError,
    UniqueConstraintError
} = require("sequelize");

const errorHandler = (err, req, res, next) => {

    console.error("ERROR:", err);

    if (err instanceof ValidationError) {

        return res.status(400).json({
            error: "Error de validación",
            detalles: err.errors.map(error => error.message)
        });

    }

    if (err instanceof UniqueConstraintError) {

        return res.status(409).json({
            error: "El registro ya existe"
        });

    }

    return res.status(500).json({
        error: "Error interno del servidor"
    });

};

module.exports = errorHandler;
