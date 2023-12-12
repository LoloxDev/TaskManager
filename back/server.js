const express = require('express');
const app = express();
const port = 3033;
// app.js

require('dotenv').config({ path: '.env.local' });
console.log(process.env)


const { get_connection_db } = require('./connexion_bdd');
const verifyToken = require('./verifyToken');

const path = require('path');

app.use(express.static(path.join(__dirname, '../front'))); 

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../front/login.html'));
});

app.use(express.json());

app.post('/verifyToken', verifyToken, (req, res) => {
    res.json({ success: true, token: req.body['token'] });
});

app.use(verifyToken);

// Routes protégées nécessitant une authentification
app.get('/tasks', (request, response) => {
    let connection = get_connection_db();
    let sql;
    
    if(request.query.status){
        sql = `SELECT * FROM tasks WHERE isDone = ${request.query.status}`
    } else {
        sql = `SELECT * FROM tasks`
    }
        connection.query(sql, function (error, results, fields) {
            connection.end();
            if (error) {
                console.error('Erreur lors de la récupération des tâches :', error);
                response.status(500).json({ error: 'Erreur lors de la récupération des tâches' });
            } else {
                response.json(results);
            }
        });
    });

app.post('/addTask', (request, response) => {
    const connection = get_connection_db();
    const sql = 'INSERT INTO tasks (name, isDone) VALUES (?, ?)';
    connection.query(sql, [request.body.taskName, request.body.taskStatus], (error, results) => {
        connection.end();
        if (error) {
            console.error('Erreur lors de l\'ajout de la tâche :', error);
            response.status(500).json({ error: 'Erreur lors de l\'ajout de la tâche', success: false });
        } else {
            console.log('Tâche ajoutée avec succès !');
            response.status(200).json({ message: 'Tâche ajoutée avec succès', success: true });
        }
    });
});

app.post('/editTask', (request, response) => {
    const connection = get_connection_db();
    const sql = 'UPDATE tasks SET name = ?, isDone = ? WHERE id = ?';
    connection.query(sql, [request.body.taskName, request.body.taskStatus, request.body.taskId], (error, results) => {
        connection.end();
        if (error) {
            console.error('Erreur lors de la modification de la tâche :', error);
            response.status(500).json({ error: 'Erreur lors de la modification de la tâche', success: false });
        } else {
            console.log('Tâche modifiée avec succès !');
            response.status(200).json({ message: 'Tâche modifiée avec succès', success: true });
        }
    });
});

app.delete('/deleteTask/:id', (request, response) => {
    const taskId = request.params.id;
    const connection = get_connection_db();
    const sql = 'DELETE FROM tasks WHERE id = ?';
    connection.query(sql, [taskId], (error, results) => {
        connection.end();
        if (error) {
            console.error('Erreur lors de la suppression de la tâche :', error);
            response.status(500).json({ error: 'Erreur lors de la suppression de la tâche', success: false });
        } else {
            console.log('Tâche supprimée avec succès !');
            response.status(200).json({ message: 'Tâche supprimée avec succès', success: true });
        }
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
