// taskRoutes.js

const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Middleware d'authentification
const isAuthenticated = require('../middlewares/authMiddleware');

// Route pour récupérer toutes les tâches de l'utilisateur
router.get('/tasks', isAuthenticated, taskController.getAllTasks);

// Route pour ajouter une nouvelle tâche pour l'utilisateur
router.post('/tasks', isAuthenticated, taskController.addTask);

// Route pour modifier une tâche existante
router.put('/tasks/:id', isAuthenticated, taskController.editTask);

// Route pour supprimer une tâche existante
router.delete('/tasks/:id', isAuthenticated, taskController.deleteTask);

module.exports = router;
