const request = require('supertest');
const express = require('express');
const session = require('express-session');
const authRoutes = require('./../server/app/routes/authRoutes');
const userModel = require('./../server/app/models/userModel');
const bcrypt = require('bcrypt');

const app = express();

app.use(express.json());
app.use(session({ secret: 'keyTest', resave: false, saveUninitialized: false }));

app.use('/auth', authRoutes);

jest.mock('./../server/app/models/userModel');

// CONFIGS //

let server;
beforeAll((done) => {

    // Lancement serveur
    server = app.listen(3030, () => {
        console.log('Serveur démarré sur le port 3030');
        done();
    });

    // Création du mock
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
});

afterEach(() => {
    jest.clearAllMocks();
});

afterAll((done) => {
    jest.restoreAllMocks();
    server.close(done);
});

// TESTS //

describe('Tests des routes authentification', () => {

    describe('Inscription', () => {
        it('Doit inscrire un utilisateur Alice', async () => {
            const userData = {
                firstName: 'Alice',
                lastName: 'Smith',
                email: 'alice.smith@example.com',
                password: 'password123'
            };
            const response = await request(app)
                .post('/auth/register')
                .send(userData);
            expect(response.status).toBe(302);
        });

        it('Doit fail car meme email', async () => {
            const userData = {
                firstName: 'Alice',
                lastName: 'Smisse',
                email: 'alice.smith@example.com',
                password: 'password123'
            };
            const response = await request(app)
                .post('/auth/register')
                .send(userData);
            expect(response.status).toBe(401);
        });
    });

    describe('Connexion', () => {

        it('Doit se connecter à l\'utilisateur John Doe', async () => {
            const userData = {
                email: 'john.doe@example.com',
                password: 'password123'
            };
            const response = await request(app)
                .post('/auth/login')
                .send(userData);
            expect(response.status).toBe(302);
        });

        it('Doit fail car identifiants invalides', async () => {
            const userData = {
                email: 'john.doe@example.com',
                password: 'wrongpassword'
            };
            const response = await request(app)
                .post('/auth/login')
                .send(userData);
            expect(response.status).toBe(401);
        });

    });
});
