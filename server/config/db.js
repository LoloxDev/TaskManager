const knex = require('knex');
const knexConfig = require('./knexfile');

const dbConnection = knex(knexConfig.development);

module.exports = dbConnection;
