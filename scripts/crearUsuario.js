
require("dotenv").config();

const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario");

async function crearUsuario() {
    try {
        const username = "alisson";
        const password = process.env.ADMIN_INITIAL_PASSWORD;

        if (!password) {
            throw new Error(
                "Falta configurar ADMIN_INITIAL_PASSWORD"
            );
        }

        const existente = await Usuario.findOne({
            where: { username }
        });

        if (existente) {
            console.log(
                "El usuario ya existe. No se creó otro."
            );
            return;
        }

        const passwordHash = await bcrypt.hash(password, 10);

        await Usuario.create({
            nombre: "Alisson",
            username,
            password: passwordHash,
            rol: "ADMIN"
        });

        console.log(
            "Administrador creado correctamente: alisson"
        );
    } catch (error) {
        console.error("Error al crear administrador:", error);
        process.exitCode = 1;
    } finally {
        const sequelize = require("../config/database");
        await sequelize.close();
    }
}

crearUsuario();
