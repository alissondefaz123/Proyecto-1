const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario");

async function crearUsuario() {
    try {
        const passwordHash = await bcrypt.hash("Alisson123", 10);

        const usuario = await Usuario.create({
            nombre: "Alisson",
            username: "alisson",
            password: passwordHash,
            rol: "ADMIN"
        });

        console.log("Usuario creado correctamente:");
        console.log({
            id: usuario.id,
            nombre: usuario.nombre,
            username: usuario.username,
            rol: usuario.rol
        });

        process.exit(0);

    } catch (error) {
        console.error("Error al crear usuario:", error);
        process.exit(1);
    }
}

crearUsuario();