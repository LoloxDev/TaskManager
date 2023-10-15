const mysql = require('mysql2');

function get_connection_db() {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: "exojs"
    });

    return connection;
}

module.exports = {
    get_connection_db: get_connection_db
};
