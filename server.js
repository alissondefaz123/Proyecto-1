const express = require("express");
const path = require("path");
require("dotenv").config();

const cors = require("cors");
const helmet = require("helmet");

const sequelize = require("./config/database");

const incidentesRoutes = require("./routes/incidentes.routes");
const authRoutes = require("./routes/auth.routes");

const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");

const app = express();

const PORT = process.env.PORT || 3000;


// ======================================================
// SEGURIDAD - HELMET + CONTENT SECURITY POLICY
// ======================================================

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],

                // Solo JavaScript del propio proyecto
                scriptSrc: ["'self'"],

                // NO permitimos onclick, onsubmit, etc.
                scriptSrcAttr: ["'none'"],

                // Permitimos Bootstrap CSS externo
                styleSrc: [
                    "'self'",
                    "https://cdn.jsdelivr.net"
                ],

                styleSrcElem: [
                    "'self'",
                    "https://cdn.jsdelivr.net"
                ],

                // Imágenes locales y data
                imgSrc: [
                    "'self'",
                    "data:"
                ],

                // Fuentes
                fontSrc: [
                    "'self'",
                    "https://cdn.jsdelivr.net"
                ],

                // Peticiones únicamente al mismo servidor
                connectSrc: [
                    "'self'"
                ],

                objectSrc: ["'none'"],

                baseUri: ["'self'"],

                formAction: ["'self'"],

                frameAncestors: ["'self'"]
            }
        }
    })
);


// ======================================================
// CORS
// ======================================================

const permitidos = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || permitidos.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("Origen no permitido por CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));


// ======================================================
// MIDDLEWARE GENERAL
// ======================================================

app.use(express.json());

app.use(logger);
app.get("/health", async (req, res) => {
    try {
        await sequelize.authenticate();

        res.status(200).json({
            status: "ok",
            database: "connected"
        });
    } catch (error) {
        res.status(503).json({
            status: "error",
            database: "disconnected"
        });
    }
});


// ======================================================
// ARCHIVOS DEL FRONTEND
// ======================================================

app.use(
    express.static(path.join(__dirname, "public"))
)

// ======================================================
// AUTENTICACIÓN
// ======================================================

app.use(
    "/api/auth",
    authRoutes
);


// ======================================================
// API DE INCIDENTES
// ======================================================

app.use(
    "/api/incidentes",
    incidentesRoutes
);


// ======================================================
// MANEJO CENTRALIZADO DE ERRORES
// ======================================================

app.use(errorHandler);


// ======================================================
// CONEXIÓN A BASE DE DATOS
// ======================================================

sequelize.authenticate()

    .then(() => {

        console.log(
            "Conexión con SQLite establecida correctamente."
        );

        app.listen(PORT, () => {

            console.log(
                `Servidor ejecutándose en http://localhost:${PORT}`
            );

            console.log(
                `Login disponible en http://localhost:${PORT}/login.html`
            );

            console.log(
                `API disponible en http://localhost:${PORT}/api/incidentes`
            );

        });

    })

    .catch((error) => {

        console.error(
            "No se pudo conectar con la base de datos:",
            error
        );

    });
    