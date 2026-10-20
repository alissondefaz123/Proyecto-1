
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");

const router = express.Router();

// REGISTRO DE USUARIOS
router.post("/registro", async (req, res, next) => {
    try {
        const { nombre, username, password } = req.body;

        // Validar campos obligatorios
        if (
            typeof nombre !== "string" ||
            typeof username !== "string" ||
            typeof password !== "string" ||
            !nombre.trim() ||
            !username.trim() ||
            !password
        ) {
            return res.status(400).json({
                error: "Datos inválidos",
                mensaje: "El nombre, el usuario y la contraseña son obligatorios"
            });
        }

        const nombreLimpio = nombre.trim();
        const usernameLimpio = username.trim();

        // Validar longitudes
        if (nombreLimpio.length > 100) {
            return res.status(400).json({
                error: "Datos inválidos",
                mensaje: "El nombre no puede superar los 100 caracteres"
            });
        }

        if (
            usernameLimpio.length < 3 ||
            usernameLimpio.length > 30 ||
            !/^[a-zA-Z0-9_.-]+$/.test(usernameLimpio)
        ) {
            return res.status(400).json({
                error: "Datos inválidos",
                mensaje: "El usuario debe tener entre 3 y 30 caracteres y solo puede contener letras, números, puntos, guiones y guiones bajos"
            });
        }

        if (password.length < 8 || password.length > 72) {
            return res.status(400).json({
                error: "Datos inválidos",
                mensaje: "La contraseña debe tener entre 8 y 72 caracteres"
            });
        }

        // Comprobar si el usuario ya existe
        const existente = await Usuario.findOne({
            where: { username: usernameLimpio }
        });

        if (existente) {
            return res.status(409).json({
                error: "Usuario existente",
                mensaje: "Ese nombre de usuario ya está registrado"
            });
        }

        // Cifrar la contraseña antes de guardarla
        const passwordHash = await bcrypt.hash(password, 10);

        // El rol se asigna en el servidor, nunca desde el formulario
        const nuevoUsuario = await Usuario.create({
            nombre: nombreLimpio,
            username: usernameLimpio,
            password: passwordHash,
            rol: "ANALISTA"
        });

        return res.status(201).json({
            mensaje: "Cuenta creada correctamente. Ya puedes iniciar sesión.",
            usuario: {
                id: nuevoUsuario.id,
                nombre: nuevoUsuario.nombre,
                username: nuevoUsuario.username,
                rol: nuevoUsuario.rol
            }
        });
    } catch (error) {
        // Manejar posibles duplicados, incluso si dos solicitudes
        // intentan registrar el mismo usuario al mismo tiempo.
        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(409).json({
                error: "Usuario existente",
                mensaje: "Ese nombre de usuario ya está registrado"
            });
        }

        next(error);
    }
});

// INICIO DE SESIÓN
router.post("/login", async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (
            typeof username !== "string" ||
            typeof password !== "string" ||
            !username.trim() ||
            !password
        ) {
            return res.status(400).json({
                error: "Datos inválidos",
                mensaje: "El usuario y la contraseña son obligatorios"
            });
        }

        const usuario = await Usuario.findOne({
            where: { username: username.trim() }
        });

        if (!usuario) {
            return res.status(401).json({
                error: "Credenciales incorrectas"
            });
        }

        const passwordCorrecta = await bcrypt.compare(
            password,
            usuario.password
        );

        if (!passwordCorrecta) {
            return res.status(401).json({
                error: "Credenciales incorrectas"
            });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                error: "Error de configuración del servidor"
            });
        }

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

        return res.status(200).json({
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
