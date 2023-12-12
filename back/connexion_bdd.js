// connexion_bdd.js

const mysql = require('mysql2');
const { Pool } = require('pg');

function get_connection_db() {
    const commonConfig = {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD
    };

    if (process.env.DB_TYPE === 'mysql') {
        return mysql.createConnection({
            ...commonConfig,
        });
    } else {
        return new Pool({
            ...commonConfig,
            port: 5432,
        });
    }
}

module.exports = {
    get_connection_db: get_connection_db
};
