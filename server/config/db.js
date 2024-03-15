const knex = require('knex');
const knexConfig = require('./knexfile');

// Initialisez Knex avec la configuration appropriée
const dbConnection = knex(knexConfig.development);

module.exports = dbConnection;
