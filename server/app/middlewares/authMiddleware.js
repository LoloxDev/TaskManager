/**
 * @module authMiddleware
 */

/**
 * Middleware pour vérifier si l'utilisateur est authentifié.
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns {void}
 * @memberof module:authMiddleware
*/
const isAuthenticated = (req, res, next) => {
    if (req.session.authenticated) {
        next();
    } else {
        res.redirect('/login');
    }
};

module.exports = isAuthenticated;
