const express = require("express");

const router = express.Router();

const {
    obtenerIncidentes,
    obtenerIncidente,
    crearIncidente,
    actualizarIncidente,
    actualizarParcial,
    eliminarIncidente
} = require("../controllers/incidentes.controller");

const {
    verificarToken,
    verificarRol
} = require("../middleware/auth");

const {
    validarIncidente,
    validarIncidenteParcial
} = require("../middleware/validacion");


// =====================================================
// GET - TODOS
// =====================================================

router.get(
    "/",
    verificarToken,
    obtenerIncidentes
);


// =====================================================
// GET - UNO
// =====================================================

router.get(
    "/:id",
    verificarToken,
    obtenerIncidente
);


// =====================================================
// POST - CREAR
// ADMIN Y ANALISTA
// =====================================================

router.post(
    "/",
    verificarToken,
    verificarRol("ADMIN", "ANALISTA"),
    validarIncidente,
    crearIncidente
);


// =====================================================
// PUT - ACTUALIZAR COMPLETO
// ADMIN Y ANALISTA
// =====================================================

router.put(
    "/:id",
    verificarToken,
    verificarRol("ADMIN", "ANALISTA"),
    validarIncidente,
    actualizarIncidente
);


// =====================================================
// PATCH - ACTUALIZACIÓN PARCIAL
// ADMIN Y ANALISTA
// =====================================================

router.patch(
    "/:id",
    verificarToken,
    verificarRol("ADMIN", "ANALISTA"),
    validarIncidenteParcial,
    actualizarParcial
);


// =====================================================
// DELETE - SOLO ADMIN
// =====================================================

router.delete(
    "/:id",
    verificarToken,
    verificarRol("ADMIN"),
    eliminarIncidente
);


module.exports = router;
