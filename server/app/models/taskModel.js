const dbConnection = require('../../config/db'); // Importez la connexion à la base de données depuis votre configuration

// Récupérer toutes les tâches associées à un utilisateur
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

// Ajouter une nouvelle tâche pour un utilisateur
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

// Modifier une tâche existante
exports.editTask = async (taskId, taskDetails) => {
    try {
        await dbConnection('tasks').where('id', taskId).update(taskDetails);
        return true;
    } catch (error) {
        console.error('Erreur lors de la modification de la tâche :', error);
        throw error;
    }
};

// Supprimer une tâche existante
exports.deleteTask = async (taskId) => {
    try {
        await dbConnection('tasks').where('id', taskId).del();
        return true;
    } catch (error) {
        console.error('Erreur lors de la suppression de la tâche :', error);
        throw error;
    }
};
