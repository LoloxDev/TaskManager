/**
 * @module loggingMiddleware
 */

const fs = require('fs');
const path = require('path');

const logsDirectory = path.join(__dirname, '../../logs');

if (!fs.existsSync(logsDirectory)) {
    fs.mkdirSync(logsDirectory);
}

const logFilePath = path.join(logsDirectory, 'access.log');

/**
 * Middleware pour enregistrer les accès dans un fichier de log.
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns {void}
 * @memberof module:loggingMiddleware
 */
const loggingMiddleware = (req, res, next) => {
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const logMessage = `${new Date().toISOString()} - ${req.method} ${req.url} - User: ${req.session.user ? req.session.user.id : 'anonymous'} - IP: ${ipAddress} - Request Data: ${JSON.stringify(req.body)} - Query Parameters: ${JSON.stringify(req.query)}\n`;

    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) {
            console.error('Erreur lors de l\'écriture du log :', err);
        }
    });

    next();
};

module.exports = loggingMiddleware;
