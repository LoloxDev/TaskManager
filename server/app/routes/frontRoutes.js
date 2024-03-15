const express = require('express');
const router = express.Router();

// Route pour la page de connexion
router.get('/login', (req, res) => {
    res.render('login');
});

// Route pour la page d'inscription
router.get('/register', (req, res) => {
    res.render('register');
});

// Route pour la page de connexion
router.get('/taskPanel', (req, res) => {
    res.render('taskPanel');
});


module.exports = router;