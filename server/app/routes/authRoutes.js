// authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route pour la connexion de l'utilisateur
router.post('/login', authController.login);

// Route pour la déconnexion de l'utilisateur
router.get('/logout', authController.logout);

// Route pour l'inscription d'un nouvel utilisateur
router.post('/register', authController.register);

module.exports = router;
