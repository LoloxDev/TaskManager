/**
 * @module taskRoutes
 */


/**
 * Toutes les routes sont sécurisées par le Middleware isAuthenticated.
 */

const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

const isAuthenticated = require('../middlewares/authMiddleware');

/**
 * GET /api/tasks
 * Route pour récupérer toutes les tâches de l'utilisateur.
 * @name GET /api/tasks
 * @function
 * @memberof module:taskRoutes
 */
router.get('/tasks', isAuthenticated, taskController.getAllTasks);

/**
 * POST /api/tasks
 * Route pour ajouter une nouvelle tâche pour l'utilisateur.
 * @name POST /api/tasks
 * @function
 * @memberof module:taskRoutes
 */
router.post('/tasks', isAuthenticated, taskController.addTask);

/**
 * PUT /api/tasks/:id
 * Route pour modifier une tâche existante.
 * @name PUT /api/tasks/:id
 * @function
 * @memberof module:taskRoutes
 */
router.put('/tasks/:id', isAuthenticated, taskController.editTask);

/**
 * DELETE /api/tasks/:id
 * Route pour supprimer une tâche existante.
 * @name DELETE /api/tasks/:id
 * @function
 * @memberof module:taskRoutes
 */
router.delete('/tasks/:id', isAuthenticated, taskController.deleteTask);

module.exports = router;
