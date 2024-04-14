/**
 * @module userRoutes
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const rolesMiddleware = require('../middlewares/rolesMiddleware');

/**
 * GET /api/user
 * Route pour récupérer l'utilisateur connecté.
 * @name GET /api/user
 * @function
 * @memberof module:userRoutes
 */
router.get('/user', rolesMiddleware(['admin', 'super']), userController.getUserConnected);

/**
 * GET /api/userByEmail
 * Route pour rechercher un utilisateur par son adresse e-mail.
 * @name GET /api/userByEmail
 * @function
 * @memberof module:userRoutes
 */
router.get('/userByEmail', rolesMiddleware(['admin', 'super']), userController.getUserByEmail); // Utilisation du middleware pour sécuriser la route

module.exports = router;
