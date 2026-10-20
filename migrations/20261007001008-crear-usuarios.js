'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('usuarios', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },

            nombre: {
                type: Sequelize.STRING(100),
                allowNull: false
            },

            username: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true
            },

            password: {
                type: Sequelize.STRING,
                allowNull: false
            },

            rol: {
                type: Sequelize.ENUM('ADMIN', 'ANALISTA'),
                allowNull: false,
                defaultValue: 'ANALISTA'
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
        await queryInterface.dropTable('usuarios');
    }
};