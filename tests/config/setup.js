const express = require('express');
const request = require('supertest');
const session = require('express-session');
const userModel = require('../../server/app/models/userModel');
const bcrypt = require('bcrypt');

const app = express();

app.use(express.json());
app.use(session({ secret: 'keyTest', resave: false, saveUninitialized: false }));



jest.mock('../../server/app/models/userModel');

// *************
// ** CONFIGS **
// *************

// DEMARAGE DU SERVEUR

function startServer() {
    return new Promise((resolve, reject) => {
        const server = app.listen(6050, () => {
            console.log('Serveur démarré sur le port 3030');
            resolve(server);
        });
    });
}

// CREATION DU MOCK USER //

function configureUserModelMock() {
    userModel.findByEmail.mockImplementation((email) => {
        if (email === 'john.doe@example.com') {
            return {
                email: 'john.doe@example.com',
                password: bcrypt.hashSync('password123', 10)
            };
        } else {
            return null;
        }
    });
}

// SIMULATION DE LA CONNEXION DE L'UTILISATEUR //

async function loginUser(email, password) {
    const agent = request.agent(app);

    const response = await agent.post('/auth/login').send({
        email: email,
        password: password
    });

    return agent;
}

// FERMETURE DU SERVEUR

function closeServer(server) {
    return new Promise((resolve, reject) => {
        server.close(() => {
            console.log('Serveur arrêté');
            resolve();
        });
    });
}

module.exports = {
    startServer,
    configureUserModelMock,
    closeServer,
    loginUser,
    app
};
