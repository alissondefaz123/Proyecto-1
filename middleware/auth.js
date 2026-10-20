const jwt = require("jsonwebtoken");

function verificarToken(req, res, next) {
    try {
        const encabezado = req.headers.authorization;

        if (!encabezado) {
            return res.status(401).json({
                error: "Acceso no autorizado",
                mensaje: "Se requiere un token JWT"
            });
        }

        const partes = encabezado.split(" ");

        if (partes.length !== 2 || partes[0] !== "Bearer") {
            return res.status(401).json({
                error: "Token inválido",
                mensaje: "El formato debe ser: Bearer TOKEN"
            });
        }

        const token = partes[1];

        const usuario = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.usuario = usuario;

        next();

    } catch (error) {
        return res.status(401).json({
            error: "Token inválido o expirado"
        });
    }
}

function verificarRol(...rolesPermitidos) {
    return (req, res, next) => {

        if (!req.usuario) {
            return res.status(401).json({
                error: "Usuario no autenticado"
            });
        }

        if (!rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).json({
                error: "Permisos insuficientes",
                mensaje: "No tiene permisos para realizar esta acción"
            });
        }

        next();
    };
}

module.exports = {
    verificarToken,
    verificarRol
};