const express = require('express');
const session = require('express-session');
const userModel = require('../../server/app/models/userModel');
const taskModel = require('../../server/app/models/taskModel');
const bcrypt = require('bcrypt');

const app = express();

app.use(express.json());
app.use(session({ secret: 'keyTest', resave: false, saveUninitialized: false }));

jest.mock('../../server/app/models/userModel');
jest.mock('../../server/app/models/taskModel');

// CONFIGURATION DU MOCK USER //

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

// CONFIGURATION DU MOCK TASK //

function configureTaskModelMock() {
    taskModel.getAllTasksByUserId.mockImplementation((userId) => {
        // Simulez le comportement de la fonction getAllTasksByUserId en fonction de l'ID de l'utilisateur
        if (userId === '123') {
            return [
                { id: 1, title: 'Task 1', userId: '123' },
                { id: 2, title: 'Task 2', userId: '123' },
            ];
        } else {
            return [];
        }
    });
}

// SIMULATION DE LA CONNEXION DE L'UTILISATEUR //

async function loginUser(agent, email, password) {
    await agent.post('/auth/login').send({
        email: email,
        password: password
    });

    return agent;
}

module.exports = {
    configureUserModelMock,
    configureTaskModelMock,
    loginUser,
    app
};
