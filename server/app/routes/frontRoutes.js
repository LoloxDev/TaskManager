/**
 * @module frontRoutes
 */

const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middlewares/authMiddleware');

/**
 * GET /login
 * Route pour la page de connexion.
 * @name GET /login
 * @function
 * @memberof module:frontRoutes
 */
router.get('/login', (req, res) => {
    res.render('login');
});

/**
 * GET /register
 * Route pour la page d'inscription.
 * @name GET /register
 * @function
 * @memberof module:frontRoutes
 */
router.get('/register', (req, res) => {
    res.render('register');
});

/**
 * GET /taskPanel
 * Route pour la page du tableau de tâches.
 * Middleware isAuthenticated est utilisé pour vérifier si l'utilisateur est authentifié.
 * @name GET /taskPanel
 * @function
 * @memberof module:frontRoutes
 */
router.get('/taskPanel', isAuthenticated, (req, res) => {
    res.render('taskPanel');
});

module.exports = router;
