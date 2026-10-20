const { body, validationResult } = require("express-validator");
const { SEVERIDADES, ESTADOS, tieneCamposActualizables } = require("../utils/reglasIncidente.cjs");

const validarIncidente = [
    body("tipo")
        .trim()
        .customSanitizer(valor => valor.replace(/[<>]/g, ""))
        .notEmpty()
        .withMessage("El tipo de incidente es obligatorio")
        .isLength({ min: 3, max: 100 })
        .withMessage("El tipo debe tener entre 3 y 100 caracteres"),

    body("severidad")
        .trim()
        .isIn(SEVERIDADES)
        .withMessage("La severidad no es válida"),

    body("estado")
        .optional()
        .trim()
        .isIn(ESTADOS)
        .withMessage("El estado no es válido"),

    body("fecha")
        .trim()
        .isISO8601({ strict: true, strictSeparator: true })
        .withMessage("La fecha no es válida"),

    body("responsable")
        .trim()
        .customSanitizer(valor => valor.replace(/[<>]/g, ""))
        .notEmpty()
        .withMessage("El responsable es obligatorio")
        .isLength({ min: 3, max: 100 })
        .withMessage("El responsable debe tener entre 3 y 100 caracteres"),

    body("descripcion")
        .optional()
        .trim()
        .customSanitizer(valor => valor.replace(/[<>]/g, ""))
        .isLength({ max: 1000 })
        .withMessage("La descripción no puede superar los 1000 caracteres"),

    (req, res, next) => {

        const errores = validationResult(req);

        if (!errores.isEmpty()) {
            return res.status(400).json({
                error: "Datos inválidos",
                detalles: errores.array().map(error => error.msg)
            });
        }

        next();
    }
];
const validarIncidenteParcial = [
    body("tipo")
        .optional()
        .trim()
        .customSanitizer(valor =>
            valor.replace(/[<>]/g, "")
        )
        .isLength({ min: 3, max: 100 })
        .withMessage(
            "El tipo debe tener entre 3 y 100 caracteres"
        ),

    body("severidad")
        .optional()
        .trim()
        .isIn([
            "Baja",
            "Media",
            "Alta",
            "Crítica"
        ])
        .withMessage(
            "La severidad no es válida"
        ),

    body("estado")
        .optional()
        .trim()
        .isIn([
            "Abierto",
            "En análisis",
            "Resuelto"
        ])
        .withMessage(
            "El estado no es válido"
        ),

    body("fecha")
        .optional()
        .trim()
        .isISO8601({ strict: true, strictSeparator: true })
        .withMessage(
            "La fecha no es válida"
        ),

    body("responsable")
        .optional()
        .trim()
        .customSanitizer(valor =>
            valor.replace(/[<>]/g, "")
        )
        .isLength({ min: 3, max: 100 })
        .withMessage(
            "El responsable debe tener entre 3 y 100 caracteres"
        ),

    body("descripcion")
        .optional()
        .trim()
        .customSanitizer(valor =>
            valor.replace(/[<>]/g, "")
        )
        .isLength({ max: 1000 })
        .withMessage(
            "La descripción no puede superar los 1000 caracteres"
        ),

    (req, res, next) => {

        if (!tieneCamposActualizables(req.body)) {
            return res.status(400).json({
                error: "Debe enviar al menos un campo válido para actualizar."
            });
        }

        const errores =
            validationResult(req);

        if (!errores.isEmpty()) {

            return res.status(400).json({

                error: "Datos inválidos",

                detalles:
                    errores.array()
            });
        }

        next();
    }
];

module.exports = {
    validarIncidente,
    validarIncidenteParcial
};