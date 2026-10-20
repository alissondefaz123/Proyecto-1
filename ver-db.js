const sequelize = require("./config/database");
const Incidente = require("./models/incidentes.model");

async function verBaseDatos() {
    try {

        await sequelize.authenticate();

        console.log("\n===== BASE DE DATOS =====\n");

        const incidentes = await Incidente.findAll({
            raw: true
        });

        console.table(incidentes);

        await sequelize.close();

    } catch (error) {

        console.error("Error:", error);

    }
}

verBaseDatos();
