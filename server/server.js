require('dotenv').config({ path: '.env.local' });
console.log(process.env);

const express = require('express');
const session = require('express-session');
const path = require('path');
const loggingMiddleware = require('./app/middlewares/loggingMiddleware');
const bodyParser = require('body-parser');

// Import des routes
const authRoutes = require('./app/routes/authRoutes');
const taskRoutes = require('./app/routes/taskRoutes');
const userRoutes = require('./app/routes/userRoutes');
const frontRoute = require('./app/routes/frontRoutes');

// Initialisation de l'application Express
const app = express();
const port = process.env.PORT || 3033;

// Configuration du moteur de template EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './app/views'));

// Configuration de la session
app.use(session({
    secret: 'votre_secret_key',
    resave: true,
    saveUninitialized: true
}));

// Middleware pour le logging
app.use(loggingMiddleware);

// Middleware pour analyser les données de formulaire
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware pour traiter les données JSON
app.use(express.json());

// Middleware pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, '../public')));

// Middleware pour les routes front
app.use('/', frontRoute);

// Middleware pour les routes d'authentification
app.use('/auth', authRoutes);

// Middleware pour les routes de gestion des tâches
app.use('/tasks', taskRoutes);

// Middleware pour les routes de gestion des utilisateurs
app.use('/user', userRoutes);

// Middleware pour gérer les erreurs 404
app.use((req, res, next) => {
    res.status(404).send("Page introuvable");
});

// Middleware pour gérer les erreurs globales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Une erreur s\'est produite!');
});

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Serveur en écoute sur le port ${port}`);
});
