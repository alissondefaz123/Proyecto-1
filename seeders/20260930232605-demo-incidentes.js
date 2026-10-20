"use strict";

module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert("incidentes", [
            {
                id: "INC-001",
                tipo: "Phishing",
                severidad: "Alta",
                estado: "Abierto",
                fecha: "2026-09-07",
                responsable: "Laura M.",
                descripcion:
                    "Se detectó un correo electrónico sospechoso enviado a varios usuarios de la organización.",
                createdAt: new Date(),
                updatedAt: new Date()
            },

            {
                id: "INC-002",
                tipo: "Malware",
                severidad: "Crítica",
                estado: "En análisis",
                fecha: "2026-09-07",
                responsable: "Carlos R.",
                descripcion:
                    "Se detectó software malicioso en un equipo de la organización.",
                createdAt: new Date(),
                updatedAt: new Date()
            },

            {
                id: "INC-003",
                tipo: "Acceso no autorizado",
                severidad: "Media",
                estado: "Abierto",
                fecha: "2026-09-06",
                responsable: "Andrea P.",
                descripcion:
                    "Se identificó un intento de acceso no autorizado a una cuenta institucional.",
                createdAt: new Date(),
                updatedAt: new Date()
            },

            {
                id: "INC-004",
                tipo: "DDoS",
                severidad: "Alta",
                estado: "Resuelto",
                fecha: "2026-09-05",
                responsable: "Diego S.",
                descripcion:
                    "Se detectó un intento de ataque de denegación de servicio contra un servicio institucional.",
                createdAt: new Date(),
                updatedAt: new Date()
            },

            {
                id: "INC-005",
                tipo: "Ransomware",
                severidad: "Crítica",
                estado: "En análisis",
                fecha: "2026-09-04",
                responsable: "María T.",
                descripcion:
                    "Se detectó actividad asociada a ransomware en un equipo de la organización.",
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete("incidentes", null, {});
    }
};
