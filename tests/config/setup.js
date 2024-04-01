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

    await agent.post('/auth/login').send({
        email: email,
        password: password
    });

    // Créer un objet session pour simuler l'authentification
    agent.session = { authenticated: true };

    return agent;
};


module.exports = {
    configureUserModelMock,
    loginUser,
    app
};
