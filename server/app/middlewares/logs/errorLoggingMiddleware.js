/**
 * @module errorLoggingMiddleware
 */

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

const logFormat = printf(({ timestamp, level, message }) => {
    return `${timestamp} - ${message}`;
});

const errorLogger = createLogger({
    format: combine(
        timestamp(),
        logFormat
    ),
    transports: [
        new DailyRotateFile({
            filename: path.join(__dirname, '../../../logs/error-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxFiles: '90d'
        })
    ]
});

/**
 * Middleware pour enregistrer les erreurs dans un fichier de log.
 * @param {Object} err
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns {void}
 * @memberof module:errorLoggingMiddleware
 */
const errorLoggingMiddleware = (err, req, res, next) => {
    const logMessage = `Error: ${err.message} - Stack: ${err.stack} - URL: ${req.url} - Method: ${req.method} - User: ${req.session.user ? req.session.user.id : 'anonymous'} - IP: ${req.headers['x-forwarded-for'] || req.connection.remoteAddress}`;

    errorLogger.error(logMessage);
    res.status(err.status || 500).json({ error: err.message, success: false });
};

module.exports = errorLoggingMiddleware;
