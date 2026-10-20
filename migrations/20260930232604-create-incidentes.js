"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {

        await queryInterface.createTable("incidentes", {

            id: {
                type: Sequelize.STRING,
                primaryKey: true,
                allowNull: false
            },

            tipo: {
                type: Sequelize.STRING,
                allowNull: false
            },

            severidad: {
                type: Sequelize.STRING,
                allowNull: false
            },

            estado: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: "Abierto"
            },

            fecha: {
                type: Sequelize.DATEONLY,
                allowNull: false
            },

            responsable: {
                type: Sequelize.STRING,
                allowNull: false
            },

            descripcion: {
                type: Sequelize.TEXT,
                allowNull: true
            },

            createdAt: {
                type: Sequelize.DATE,
                allowNull: false
            },

            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });
    },

    async down(queryInterface) {

        await queryInterface.dropTable("incidentes");

    }
};
