/**
 * @module rolesMiddleware
 */

/**
 * Middleware pour restreindre l'accès aux routes en fonction des rôles des utilisateurs.
 * @param {string[]} roles - Les rôles possibles sont 'super', 'admin', 'cdp', 'dev' et 'guest'.
 * @returns {Function}
 * @memberof module:rolesMiddleware
 */
const rolesMiddleware = (roles) => {
    /**
     * @param {Object} req
     * @param {Object} res
     * @param {Function} next
     * @returns {void}
     */
    return (req, res, next) => {
        if (req.session.user && roles.includes(req.session.user.role)) {
            next();
        } else {
            console.log('Accès interdit');
            res.status(403).json({ error: 'Accès interdit', success: false });
        }
    };
};

module.exports = rolesMiddleware;
