const express = require('express');
const app = express();
const port = 3033;

require('dotenv').config({ path: '.env.local' });
console.log(process.env);

const knex = require('knex');
const verifyToken = require('./verifyToken');
const knexConfig = require('../knexfile');
const path = require('path');

const dbConnection = knex(knexConfig.development);

app.use(express.static(path.join(__dirname, '../front')));

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../front/login.html'));
});

app.use(express.json());

app.post('/verifyToken', verifyToken, (req, res) => {
    res.json({ success: true, token: req.body['token'] });
});

app.use(verifyToken);

app.get('/tasks', async (request, response) => {
    try {
        let sql = dbConnection.select('*').from('tasks');

        if (request.query.status) {
            sql = sql.where('isdone', request.query.status);
        }

        const results = await sql;
        response.json(results);
    } catch (error) {
        console.error('Erreur lors de la récupération des tâches :', error);
        response.status(500).json({ error: 'Erreur lors de la récupération des tâches' });
    }
});

app.post('/addTask', async (request, response) => {
    const task = {
        name: request.body.taskName,
        isdone: request.body.taskStatus,
    };

    try {
        await dbConnection('tasks').insert(task);
        console.log('Tâche ajoutée avec succès !');
        response.status(200).json({ message: 'Tâche ajoutée avec succès', success: true });
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la tâche :', error);
        response.status(500).json({ error: 'Erreur lors de l\'ajout de la tâche', success: false, sqlError: error.sqlMessage });
    }
});

app.post('/editTask', async (request, response) => {
    const taskId = request.body.taskId;
    const task = {
        name: request.body.taskName,
        isdone: request.body.taskStatus,
    };

    try {
        await dbConnection('tasks').where('id', taskId).update(task);
        console.log('Tâche modifiée avec succès !');
        response.status(200).json({ message: 'Tâche modifiée avec succès', success: true });
    } catch (error) {
        console.error('Erreur lors de la modification de la tâche :', error);
        response.status(500).json({ error: 'Erreur lors de la modification de la tâche', success: false });
    }
});

app.delete('/deleteTask/:id', async (request, response) => {
    const taskId = request.params.id;

    try {
        await dbConnection('tasks').where('id', taskId).del();
        console.log('Tâche supprimée avec succès !');
        response.status(200).json({ message: 'Tâche supprimée avec succès', success: true });
    } catch (error) {
        console.error('Erreur lors de la suppression de la tâche :', error);
        response.status(500).json({ error: 'Erreur lors de la suppression de la tâche', success: false });
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
