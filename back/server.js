const express = require('express');
const session = require('express-session');
const app = express();
const port = 3033;

require('dotenv').config({ path: '.env.local' });
console.log(process.env);

const knex = require('knex');
const knexConfig = require('../knexfile');
const path = require('path');

const dbConnection = knex(knexConfig.development);

// Configuration express-session
app.use(session({
    secret: 'votre_secret_key',
    resave: true,
    saveUninitialized: true
  }));

app.use(express.json());

app.post('/login', express.urlencoded({ extended: false }), async (req, res) => {
    const { email, password } = req.body;
    

    try {
        
        const user = await dbConnection('users').where({email, password}).first();
        console.log(user)
        if (user) {
            req.session.regenerate(function (err){
            // Initialisez la session
            req.session.authenticated = true;
            req.session.user = user;
            req.session.save(function (err) {
                if (err) return next(err)
                res.redirect('/')
              })
            })
        }

    } catch (error) {
        console.error('Erreur lors de l\'authentification :', error);
        res.status(500).json({ message: 'error', success: false });
    }
});

// Middleware de vérification de connexion à un utilisateur

const isConnected = (req, res, next) => {
    if (req.session.authenticated) {
        next();
    } else {
        res.redirect('/login');
    }
};

app.get('/user', (req, res) => {
    // Renvoie les données de session avec la réponse
    res.status(200).json({
        message: 'Utilisateur authentifié',
        success: true,
        user: req.session.user
    });
    console.log(req.session);
});


app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../front/login.html'));
});

app.get('/inscription', (req, res) => {
    res.sendFile(path.join(__dirname, '../front/inscription.html'));
});

app.use(isConnected); // Toutes les routes après cette ligne sont innaccessible sans authentificzation.

app.use(express.static(path.join(__dirname, '../front')));

// Création de compte
app.post('/addUser', async (request, response) => {
    const user = {
        nom: request.body.firstName,
        prenom: request.body.lastName,
        email: request.body.email,
        password: request.body.password
    };

    try {
        await dbConnection('users').insert(user);
        console.log('User ajouté avec succès !');
        response.status(200).json({ message: 'User ajouté avec succès', success: true });
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'utilisateur :', error);
        response.status(500).json({ error: 'Erreur lors de l\'ajout de l\'utilisateur', success: false, sqlError: error.sqlMessage });
    }
});

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

app.post('/addTask',  async (request, response) => {
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

app.post('/editTask',  async (request, response) => {
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
