/**
 * @module userRoutes
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/**
 * GET /api/user
 * Route pour récupérer l'utilisateur connecté.
 * @name GET /api/user
 * @function
 * @memberof module:userRoutes
 */
router.get('/user', userController.getUserConnected);

/**
 * GET /api/userByEmail
 * Route pour rechercher un utilisateur par son adresse e-mail.
 * @name GET /api/userByEmail
 * @function
 * @memberof module:userRoutes
 */
router.get('/userByEmail', userController.getUserByEmail);

module.exports = router;
