const fs = require('fs');
const path = require('path');
module.exports = {
  development: {
    client: process.env.DB_TYPE,
    connection: {
      connectionString: process.env.PG_CONNECTION_STRING,
      ssl: {
        cert: fs.readFileSync('server/config/postgres_ssl/certs/out/postgres.crt'),
        key: fs.readFileSync('server/config/postgres_ssl/certs/out/postgres.key'),
        rejectUnauthorized: false
      }     
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },
};
