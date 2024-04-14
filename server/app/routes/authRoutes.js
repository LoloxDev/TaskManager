/**
 * @module authRoutes
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * Route pour la connexion de l'utilisateur.
 * @name POST /api/auth/login
 * @function
 * @memberof module:authRoutes
 */
router.post('/login', authController.login);

/**
 * Route pour la déconnexion de l'utilisateur.
 * @name GET /api/auth/logout
 * @function
 * @memberof module:authRoutes
 */
router.get('/logout', authController.logout);

/**
 * Route pour l'inscription d'un nouvel utilisateur.
 * @name POST /api/auth/register
 * @function
 * @memberof module:authRoutes
 */
router.post('/register', authController.register);

module.exports = router;
