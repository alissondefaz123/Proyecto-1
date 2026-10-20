const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");

const router = express.Router();

router.post("/login", async (req, res, next) => {
    try {
        const { username, password } = req.body;

        // Validar que lleguen los datos
        if (!username || !password) {
            return res.status(400).json({
                error: "Datos inválidos",
                mensaje: "El usuario y la contraseña son obligatorios"
            });
        }

        // Buscar usuario
        const usuario = await Usuario.findOne({
            where: { username }
        });

        if (!usuario) {
            return res.status(401).json({
                error: "Credenciales incorrectas"
            });
        }

        // Comparar contraseña con el hash
        const passwordCorrecta = await bcrypt.compare(
            password,
            usuario.password
        );

        if (!passwordCorrecta) {
            return res.status(401).json({
                error: "Credenciales incorrectas"
            });
        }

        // Crear JWT
        const token = jwt.sign(
            {
                id: usuario.id,
                username: usuario.username,
                rol: usuario.rol
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "2h"
            }
        );

        res.status(200).json({
            mensaje: "Inicio de sesión exitoso",
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                username: usuario.username,
                rol: usuario.rol
            }
        });

    } catch (error) {
        next(error);
    }
});

module.exports = router;
