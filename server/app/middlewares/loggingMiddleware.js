const fs = require('fs');
const path = require('path');

const logsDirectory = path.join(__dirname, '../../logs');

// Création du dossier de logs s'il n'existe pas
if (!fs.existsSync(logsDirectory)) {
    fs.mkdirSync(logsDirectory);
}

const logFilePath = path.join(logsDirectory, 'access.log');

const loggingMiddleware = (req, res, next) => {
    const logMessage = `${new Date().toISOString()} - ${req.method} ${req.url}\n`;

    // Ajouter le message de log au fichier access.log
    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) {
            console.error('Erreur lors de l\'écriture du log :', err);
        }
    });

    next();
};

module.exports = loggingMiddleware;
