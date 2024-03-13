const dbConnection = require('../../config/db'); // Importez la connexion à la base de données depuis votre configuration

// Récupérer toutes les tâches de l'utilisateur
exports.getAllTasks = async (req, res) => {
    try {
        // Assurez-vous que l'utilisateur est authentifié
        if (!req.session.authenticated) {
            return res.status(401).json({ error: 'Utilisateur non authentifié' });
        }

        // Récupérez les tâches associées à l'utilisateur depuis la table de jointure
        let tasks = await dbConnection('user_tasks')
            .join('tasks', 'user_tasks.task_id', '=', 'tasks.id')
            .where('user_tasks.user_id', req.session.user.id)
            .select('tasks.*');

        // Filtrer les tâches par statut si spécifié dans la requête
        if (req.query.status !== undefined) {
            const status = req.query.status === 'true'; // Convertir en booléen
            tasks = tasks.filter(task => task.isdone === status);
        }

        res.json(tasks);
    } catch (error) {
        console.error('Erreur lors de la récupération des tâches :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des tâches' });
    }
};

// Ajouter une nouvelle tâche pour l'utilisateur
exports.addTask = async (req, res) => {
    const { taskName, taskStatus } = req.body;
    const task = {
        name: taskName,
        isdone: taskStatus,
    };

    try {
        // Insérez la tâche et récupérez l'ID généré par la base de données
        const [newTaskIdObject] = await dbConnection('tasks').insert(task).returning('id');
        const taskId = newTaskIdObject.id;

        // Associez la tâche à l'utilisateur actuel en utilisant l'ID généré
        await dbConnection('user_tasks').insert({
            user_id: req.session.user.id,
            task_id: taskId,
        });

        res.status(200).json({ message: 'Tâche ajoutée avec succès', success: true });
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la tâche :', error);
        res.status(500).json({ error: 'Erreur lors de l\'ajout de la tâche', success: false, sqlError: error.sqlMessage });
    }
};

// Modifier une tâche existante
exports.editTask = async (req, res) => {
    const { taskId, taskName, taskStatus } = req.body;
    const task = {
        name: taskName,
        isdone: taskStatus,
    };

    try {
        await dbConnection('tasks').where('id', taskId).update(task);
        res.status(200).json({ message: 'Tâche modifiée avec succès', success: true });
    } catch (error) {
        console.error('Erreur lors de la modification de la tâche :', error);
        res.status(500).json({ error: 'Erreur lors de la modification de la tâche', success: false });
    }
};

// Supprimer une tâche existante
exports.deleteTask = async (req, res) => {
    const taskId = req.params.id;

    try {
        await dbConnection('tasks').where('id', taskId).del();
        res.status(200).json({ message: 'Tâche supprimée avec succès', success: true });
    } catch (error) {
        console.error('Erreur lors de la suppression de la tâche :', error);
        res.status(500).json({ error: 'Erreur lors de la suppression de la tâche', success: false });
    }
};
