require('dotenv').config({ path: '.env.local' });
console.log(process.env);

const express = require('express');
const session = require('express-session');
const path = require('path');
const accessLoggingMiddleware = require('./app/middlewares/logs/accessLoggingMiddleware');
const errorLoggingMiddleware = require('./app/middlewares/logs/errorLoggingMiddleware');
const bodyParser = require('body-parser');

const authRoutes = require('./app/routes/authRoutes');
const taskRoutes = require('./app/routes/taskRoutes');
const userRoutes = require('./app/routes/userRoutes');
const frontRoute = require('./app/routes/frontRoutes');

const app = express();
const port = process.env.PORT || 3030;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './app/views'));

app.use(session({
    secret: 'votre_secret_key',
    resave: true,
    saveUninitialized: true
}));

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(accessLoggingMiddleware);

app.use(express.static(path.join(__dirname, '../public')));

app.use('/', frontRoute);

app.use('/auth', authRoutes);

app.use('/tasks', taskRoutes);

app.use('/user', userRoutes);

app.use((req, res, next) => {
    res.status(404).send("Page introuvable");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    errorLoggingMiddleware(err, req, res, next);
    res.status(500).send('Une erreur s\'est produite!');
});
app.listen(port, () => {
    console.log(`Serveur en écoute sur le port ${port}`);
});
