const fs = require('fs');
const path = require('path');
module.exports = {
  development: {
    client: process.env.DB_TYPE,
    connection: {
      connectionString: process.env.PG_CONNECTION_STRING,
      ssl: {
        cert: fs.readFileSync('server/config/postgres_ssl/certs/out/client/postgres.crt'),
        key: fs.readFileSync('server/config/postgres_ssl/certs/out/client/postgres.key'),
        rejectUnauthorized: false
      }     
    }
  },
};
