const Incidente = require("../models/incidentes.model");


// =====================================================
// GENERAR ID AUTOMÁTICO
// =====================================================

async function generarId() {

    const incidentes = await Incidente.findAll({
        attributes: ["id"]
    });

    let mayor = 0;

    incidentes.forEach((incidente) => {

        const numero = parseInt(
            String(incidente.id).replace("INC-", "")
        );

        if (!isNaN(numero) && numero > mayor) {
            mayor = numero;
        }
    });

    return `INC-${String(mayor + 1).padStart(3, "0")}`;
}


// =====================================================
// GET - LISTAR INCIDENTES
// =====================================================

async function obtenerIncidentes(req, res, next) {

    try {

        const { estado, severidad } = req.query;

        const where = {};

        if (estado) {
            where.estado = estado;
        }

        if (severidad) {
            where.severidad = severidad;
        }

        const incidentes = await Incidente.findAll({
            where,
            order: [["createdAt", "DESC"]]
        });

        res.status(200).json(incidentes);

    } catch (error) {

        next(error);
    }
}


// =====================================================
// GET - OBTENER UNO
// =====================================================

async function obtenerIncidente(req, res, next) {

    try {

        const incidente = await Incidente.findByPk(req.params.id);

        if (!incidente) {

            return res.status(404).json({
                error: "Incidente no encontrado"
            });
        }

        res.status(200).json(incidente);

    } catch (error) {

        next(error);
    }
}


// =====================================================
// POST - CREAR
// =====================================================

async function crearIncidente(req, res, next) {

    try {

        const id = await generarId();

        const nuevoIncidente = await Incidente.create({
            id,
            tipo: req.body.tipo,
            severidad: req.body.severidad,
            estado: req.body.estado || "Abierto",
            fecha: req.body.fecha,
            responsable: req.body.responsable,
            descripcion: req.body.descripcion || ""
        });

        res.status(201).json(nuevoIncidente);

    } catch (error) {

        next(error);
    }
}


// =====================================================
// PUT - ACTUALIZAR
// =====================================================

async function actualizarIncidente(req, res, next) {

    try {

        const incidente = await Incidente.findByPk(req.params.id);

        if (!incidente) {

            return res.status(404).json({
                error: "Incidente no encontrado"
            });
        }

        await incidente.update({
            tipo: req.body.tipo,
            severidad: req.body.severidad,
            estado: req.body.estado,
            fecha: req.body.fecha,
            responsable: req.body.responsable,
            descripcion: req.body.descripcion
        });

        res.status(200).json(incidente);

    } catch (error) {

        next(error);
    }
}


// =====================================================
// PATCH - ACTUALIZACIÓN PARCIAL
// =====================================================

async function actualizarParcial(req, res, next) {

    try {

        const incidente = await Incidente.findByPk(req.params.id);

        if (!incidente) {

            return res.status(404).json({
                error: "Incidente no encontrado"
            });
        }

        const camposPermitidos = [
            "tipo",
            "severidad",
            "estado",
            "fecha",
            "responsable",
            "descripcion"
        ];

        const datos = {};

        camposPermitidos.forEach((campo) => {

            if (req.body[campo] !== undefined) {
                datos[campo] = req.body[campo];
            }

        });

        await incidente.update(datos);

        res.status(200).json(incidente);

    } catch (error) {

        next(error);
    }
}


// =====================================================
// DELETE - ELIMINAR
// =====================================================

async function eliminarIncidente(req, res, next) {

    try {

        const incidente = await Incidente.findByPk(req.params.id);

        if (!incidente) {

            return res.status(404).json({
                error: "Incidente no encontrado"
            });
        }

        await incidente.destroy();

        res.status(200).json({
            mensaje: "Incidente eliminado correctamente",
            incidente
        });

    } catch (error) {

        next(error);
    }
}


module.exports = {
    obtenerIncidentes,
    obtenerIncidente,
    crearIncidente,
    actualizarIncidente,
    actualizarParcial,
    eliminarIncidente
};
