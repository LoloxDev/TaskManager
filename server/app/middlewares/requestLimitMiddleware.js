/**
 * @module rateLimiter
 * Middleware pour la limitation du taux de requêtes.
 */

const rateLimit = require('express-rate-limit');

/**
 * Ce middleware limite le nombre de requêtes qu'une IP peut faire sur une fenêtre de temps définie,
 * aidant à protéger contre les attaques par déni de service (DDoS) et la force brute.
 *
 * @returns {Function} Middleware pour la limitation du taux de requêtes.
 */
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = limiter;
