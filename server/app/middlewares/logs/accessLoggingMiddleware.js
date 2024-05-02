/**
 * @module loggingMiddleware
 */

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

const logFormat = printf(({ timestamp, level, message }) => {
    return `${timestamp} - ${message}`;
});

const accessLogger = createLogger({
    format: combine(
        timestamp(),
        logFormat
    ),
    transports: [
        new DailyRotateFile({
            filename: path.join(__dirname, '../../../logs/access-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxFiles: '30d'
        })
    ]
});

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
    const logMessage = `${req.method} ${req.url} - User: ${req.session.user ? req.session.user.id : 'anonymous'} - IP: ${ipAddress} - Request Data: ${JSON.stringify(req.body)} - Query Parameters: ${JSON.stringify(req.query)}`;

    accessLogger.info(logMessage);
    next();
};

module.exports = loggingMiddleware;
