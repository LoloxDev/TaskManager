/**
 * @module taskModel
 */

const dbConnection = require('../../config/db');

/**
 * Récupère toutes les tâches associées à un utilisateur.
 * @param {number} userId
 * @returns {Promise<Array<Object>>}
 * @memberof module:taskModel
 */
exports.getAllTasksByUserId = async (userId) => {
    try {
        const tasks = await dbConnection('user_tasks')
            .join('tasks', 'user_tasks.task_id', '=', 'tasks.id')
            .where('user_tasks.user_id', userId)
            .select('tasks.*');
        return tasks;
    } catch (error) {
        console.error('Erreur lors de la récupération des tâches :', error);
        throw new Error('Erreur lors de la récupération des tâches');
    }
};

/**
 * Ajoute une nouvelle tâche pour un utilisateur.
 * @param {Object} taskData
 * @param {number} userId
 * @returns {Promise<void>}
 * @memberof module:taskModel
 */
exports.addTaskForUser = async (taskData, userId) => {
    try {
        const [newTaskIdObject] = await dbConnection('tasks').insert(taskData).returning('id');
        const taskId = newTaskIdObject.id;

        await dbConnection('user_tasks').insert({
            user_id: userId,
            task_id: taskId,
        });
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la tâche :', error);
        throw new Error('Erreur lors de l\'ajout de la tâche');
    }
};

/**
 * Modifie une tâche existante.
 * @param {number} taskId
 * @param {Object} taskDetails
 * @returns {Promise<boolean>}
 * @memberof module:taskModel
 */
exports.editTask = async (taskId, taskDetails) => {
    try {
        await dbConnection('tasks').where('id', taskId).update(taskDetails);
        return true;
    } catch (error) {
        console.error('Erreur lors de la modification de la tâche :', error);
        throw error;
    }
};

/**
 * Supprime une tâche existante.
 * @param {number} taskId
 * @returns {Promise<boolean>}
 * @memberof module:taskModel
 */
exports.deleteTask = async (taskId) => {
    try {
        await dbConnection('tasks').where('id', taskId).del();
        return true;
    } catch (error) {
        console.error('Erreur lors de la suppression de la tâche :', error);
        throw error;
    }
};
