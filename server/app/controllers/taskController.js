/**
 * @module taskController
 */

const taskModel = require('../models/taskModel');

/**
 * Récupère toutes les tâches de l'utilisateur.
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns {Promise<void>} 
 * @memberof module:taskController
 */
exports.getAllTasks = async (req, res, next) => {
    try {
        let tasks = await taskModel.getAllTasksByUserId(req.session.user.id);

        if (req.query.status !== undefined) {
            const validStatuses = ['true', 'false'];
            if (!validStatuses.includes(req.query.status)) {
                const error = new Error('Statut de tâche invalide');
                error.status = 400;
                return next(error);
            }
            const status = req.query.status === 'true';
            tasks = tasks.filter(task => task.isdone === status);
        }

        res.json(tasks);
    } catch (error) {
        console.error('Erreur lors de la récupération des tâches :', error);
        next(error);
    }
};

/**
 * Ajoute une nouvelle tâche pour l'utilisateur.
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns {Promise<void>} 
 * @memberof module:taskController
 */
exports.addTask = async (req, res, next) => {
    const { taskName, taskStatus } = req.body;

    if (!taskName || typeof taskName !== 'string' || taskName.trim().length === 0) {
        const error = new Error('Nom de tâche invalide');
        error.status = 400;
        return next(error);
    }

    if (!["0", "1", "2"].includes(taskStatus)) {
        const error = new Error('Statut de tâche invalide');
        error.status = 400;
        return next(error);
    }

    const task = {
        name: taskName,
        isdone: taskStatus,
    };

    try {
        await taskModel.addTaskForUser(task, req.session.user.id);
        res.status(200).json({ message: 'Tâche ajoutée avec succès', success: true });
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la tâche :', error);
        next(error);
    }
};

/**
 * Modifie une tâche existante.
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns {Promise<void>} 
 * @memberof module:taskController
 */
exports.editTask = async (req, res, next) => {
    const { taskId, taskName, taskStatus } = req.body;

    if (!taskId || typeof taskId !== 'number') {
        const error = new Error('ID de tâche invalide');
        error.status = 400;
        return next(error);
    }
    if (!taskName || typeof taskName !== 'string' || taskName.trim().length === 0) {
        const error = new Error('Nom de tâche invalide');
        error.status = 400;
        return next(error);
    }
    const validStatuses = [true, false, "0", "1", "2", undefined];
    if (!validStatuses.includes(taskStatus)) {
        const error = new Error('Statut de tâche invalide');
        error.status = 400;
        return next(error);
    }

    const task = {
        name: taskName,
        isdone: taskStatus,
    };

    try {
        await taskModel.editTask(taskId, task);
        res.status(200).json({ message: 'Tâche modifiée avec succès', success: true });
    } catch (error) {
        console.error('Erreur lors de la modification de la tâche :', error);
        next(error);
    }
};

/**
 * Supprime une tâche existante.
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns {Promise<void>} 
 * @memberof module:taskController
 */
exports.deleteTask = async (req, res, next) => {
    const taskId = req.params.id;

    if (!taskId || typeof taskId !== 'string' || taskId.trim().length === 0) {
        const error = new Error('ID de tâche invalide');
        error.status = 400;
        return next(error);
    }

    try {
        await taskModel.deleteTask(taskId);

        res.status(200).json({ message: 'Tâche supprimée avec succès', success: true });
    } catch (error) {
        console.error('Erreur lors de la suppression de la tâche :', error);
        next(error);
    }
    
};
