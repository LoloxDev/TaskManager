const express = require('express');
const session = require('express-session');
const app = express();
const port = 3033;

require('dotenv').config({ path: '.env.local' });
console.log(process.env);

const knex = require('knex');
const knexConfig = require('../knexfile');
const path = require('path');
const bcrypt = require('bcrypt');

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
        const user = await dbConnection('users').where({ email, password }).first();

        if (user) {
        
            // Vérification du mot de passe
            const hashedPassword = user.password;
            verifyPassword(password, hashedPassword)
                .then(match => {
                    if (match) {
                        console.log('Mot de passe correct');
                        req.session.regenerate(function (err) {
                            // Initialisez la session
                            req.session.authenticated = true;
                            req.session.user = user;
                            req.session.save(function (err) {
                                if (err) return next(err)
                                res.redirect('/')
                            })
                        })
                    } else {
                        console.log('Mot de passe incorrect');
                    }
                })
                .catch(error => {
                    console.error('Erreur lors de la vérification du mot de passe :', error);
                });
            console.log(user)

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

// Middleware pour servir les fichiers statiques uniquement aux utilisateurs authentifiés
const serveStaticAuthenticated = (req, res, next) => {
    if (req.session.authenticated) {
        express.static(path.join(__dirname, '../front'))(req, res, next);
    } else {
        res.redirect('/login');
    }
};

app.get('/user', isConnected, (req, res) => {
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


///////////////////////////////////////////////////////////////////////////////// SECUTITE APPLICATIVE ///////////////////////////////////////////////////////////////////////////////////////////////////


// Fonction pour hacher un mot de passe
const hashPassword = async (password) => {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.error('Erreur lors du hachage du mot de passe :', error);
        throw error;
    }
};

// Fonction pour vérifier un mot de passe haché
const verifyPassword = async (password, hashedPassword) => {
    try {
        const match = await bcrypt.compare(password, hashedPassword);
        return match;
    } catch (error) {
        console.error('Erreur lors de la vérification du mot de passe :', error);
        throw error;
    }
};

///////////////////////////////////////////////////////////////////////////////// SECUTITE APPLICATIVE //////////////////////////////////////////////////////////////////////////////////////////


app.post('/addUser', async (request, response) => {
    const user = {
        nom: request.body.firstName,
        prenom: request.body.lastName,
        email: request.body.email,
        password: request.body.password
    };

    try {
        // Vérifier si l'email existe déjà en base
        const existingUser = await dbConnection('users').where('email', user.email).first();

        if (existingUser) {
            // L'email existe déjà, renvoyer un message
            console.log('Email déjà utilisé');
            response.status(400).json({ error: 'Cet email est déjà utilisé', success: false });
        } else {
            // Hacher le mot de passe avant de l'insérer dans la base de données
            hashPassword(user.password)
                .then(hashedPassword => {
                    // Insérer l'utilisateur avec le mot de passe haché
                    return dbConnection('users').insert({
                        nom: user.nom,
                        prenom: user.prenom,
                        email: user.email,
                        password: hashedPassword
                    });
                })
                .then(() => {
                    console.log('Utilisateur ajouté avec succès !');
                    response.status(200).json({ message: 'Utilisateur ajouté avec succès', success: true });
                })
                .catch(error => {
                    console.error('Erreur lors de l\'ajout de l\'utilisateur :', error);
                    response.status(500).json({ error: 'Erreur lors de l\'ajout de l\'utilisateur', success: false, sqlError: error.sqlMessage });
                });
        }
    } catch (error) {
        console.error('Erreur lors de la vérification de l\'email existant :', error);
        response.status(500).json({ error: 'Erreur lors de la vérification de l\'email existant', success: false, sqlError: error.sqlMessage });
    }
});


// Utilisez le middleware pour servir les fichiers statiques uniquement aux utilisateurs authentifiés
app.use(serveStaticAuthenticated);

app.get('/logout', function (req, res, next) {
    req.session.user = null
    req.session.save(function (err) {
        if (err) next(err)

        req.session.regenerate(function (err) {
            if (err) next(err)
            res.redirect('/login')
        })
    })
});

app.get('/tasks', isConnected, async (request, response) => {
    try {
        // Récupérez les tâches associées à l'utilisateur depuis la table de jointure
        let tasks = await dbConnection('user_tasks')
            .join('tasks', 'user_tasks.task_id', '=', 'tasks.id')
            .where('user_tasks.user_id', request.session.user.id)
            .select('tasks.*');

        // Filtrer les tâches par statut si spécifié dans la requête
        if (request.query.status !== undefined) {
            const status = request.query.status === 'true'; // Convertir en booléen
            tasks = tasks.filter(task => task.isdone === status);
        }

        response.json(tasks);
    } catch (error) {
        console.error('Erreur lors de la récupération des tâches :', error);
        response.status(500).json({ error: 'Erreur lors de la récupération des tâches' });
    }
});

app.post('/addTask', isConnected, async (request, response) => {
    const task = {
        name: request.body.taskName,
        isdone: request.body.taskStatus,
    };

    try {
        // Insérez la tâche et récupérez l'ID généré par la base de données
        const [newTaskIdObject] = await dbConnection('tasks').insert(task).returning('id');
        const taskId = newTaskIdObject.id;

        // Associez la tâche à l'utilisateur actuel en utilisant l'ID généré
        await dbConnection('user_tasks').insert({
            user_id: request.session.user.id,
            task_id: taskId,
        });

        console.log('Tâche ajoutée avec succès !');
        response.status(200).json({ message: 'Tâche ajoutée avec succès', success: true });
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la tâche :', error);
        response.status(500).json({ error: 'Erreur lors de l\'ajout de la tâche', success: false, sqlError: error.sqlMessage });
    }
});

app.post('/editTask', isConnected, async (request, response) => {
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

app.delete('/deleteTask/:id', isConnected, async (request, response) => {
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
