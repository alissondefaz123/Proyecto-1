
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
// CORS: DESARROLLO LOCAL Y PRODUCCIÓN EN RENDER
// ======================================================

const permitidos = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://plataforma-incidentes.onrender.com",
    process.env.FRONTEND_URL
]
    .filter(Boolean)
    .map((url) => url.trim().replace(/\/+$/, ""));

app.use(
    cors({
        origin: (origin, callback) => {
            // Permitir peticiones sin Origin, por ejemplo herramientas
            // de pruebas y algunas peticiones del servidor.
            if (!origin) {
                return callback(null, true);
            }

            const origenNormalizado = origin.replace(/\/+$/, "");

            if (permitidos.includes(origenNormalizado)) {
                return callback(null, true);
            }

            console.error("Origen bloqueado por CORS:", origin);

            return callback(new Error("Origen no permitido por CORS"));
        },
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        optionsSuccessStatus: 204
    })
);

// ======================================================
// SEGURIDAD: HELMET Y CONTENT SECURITY POLICY
// ======================================================

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'"],
                scriptSrcAttr: ["'none'"],
                styleSrc: [
                    "'self'",
                    "https://cdn.jsdelivr.net"
                ],
                styleSrcElem: [
                    "'self'",
                    "https://cdn.jsdelivr.net"
                ],
                imgSrc: ["'self'", "data:"],
                fontSrc: [
                    "'self'",
                    "https://cdn.jsdelivr.net"
                ],
                connectSrc: ["'self'"],
                objectSrc: ["'none'"],
                baseUri: ["'self'"],
                formAction: ["'self'"],
                frameAncestors: ["'self'"]
            }
        }
    })
);

// ======================================================
// MIDDLEWARE GENERAL
// ======================================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// ======================================================
// COMPROBACIÓN DE SALUD Y BASE DE DATOS
// ======================================================

app.get("/health", async (req, res) => {
    try {
        await sequelize.authenticate();

        res.status(200).json({
            status: "ok",
            database: "connected"
        });
    } catch (error) {
        console.error("Error comprobando la base de datos:", error);

        res.status(503).json({
            status: "error",
            database: "disconnected"
        });
    }
});

// ======================================================
// ARCHIVOS DEL FRONTEND
// ======================================================

app.use(express.static(path.join(__dirname, "public")));

// ======================================================
// RUTAS DE AUTENTICACIÓN
// ======================================================

app.use("/api/auth", authRoutes);

// ======================================================
// API DE INCIDENTES
// ======================================================

app.use("/api/incidentes", incidentesRoutes);

// ======================================================
// MANEJO CENTRALIZADO DE ERRORES
// ======================================================

app.use(errorHandler);

// ======================================================
// CONEXIÓN A BASE DE DATOS E INICIO DEL SERVIDOR
// ======================================================

async function iniciarServidor() {
    try {
        await sequelize.authenticate();

        console.log("Conexión con SQLite establecida correctamente.");

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Servidor iniciado en el puerto ${PORT}`);
            console.log("Frontend disponible en la raíz de la aplicación.");
            console.log("API de autenticación disponible en /api/auth");
            console.log("API de incidentes disponible en /api/incidentes");
        });
    } catch (error) {
        console.error(
            "No se pudo conectar a la base de datos:",
            error
        );

        process.exit(1);
    }
}

iniciarServidor();
