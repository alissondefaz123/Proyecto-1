const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario");

async function crearAnalista() {

    try {

        const existe = await Usuario.findOne({
            where: {
                username: "analista"
            }
        });

        if (existe) {

            console.log("El usuario analista ya existe.");
            process.exit(0);
        }

        const passwordHash = await bcrypt.hash(
            "Analista123",
            10
        );

        const usuario = await Usuario.create({

            nombre: "Usuario Analista",

            username: "analista",

            password: passwordHash,

            rol: "ANALISTA"
        });

        console.log("Usuario ANALISTA creado correctamente.");

        console.log({
            id: usuario.id,
            username: usuario.username,
            rol: usuario.rol
        });

        process.exit(0);

    } catch (error) {

        console.error(
            "Error al crear usuario:",
            error
        );

        process.exit(1);
    }
}

crearAnalista();
