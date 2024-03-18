const request = require('supertest');
const express = require('express');
const session = require('express-session');
const authRoutes = require('../server/app/routes/authRoutes');
const userModel = require('../server/app/models/userModel');
const bcrypt = require('bcrypt');

const app = express();

app.use(express.json());
app.use(session({ secret: 'votre_secret_key', resave: false, saveUninitialized: false }));

app.use('/auth', authRoutes);

jest.mock('../server/app/models/userModel');

describe('Tests des routes authentification', () => {

/* SI NEED UNE SESSION USER, UTILISER LE CODE SUIVANT :

    function simulateUserSession() {
        return function (req, res, next) {
            req.session.authenticated = true;
            req.session.user = {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com'
            };
            next();
        };
    }

*/
    describe('Authentication Controller', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        describe('register', () => {
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

                expect(response.status).toBe(200);
            });
        });

        describe('login', () => {
            it('Doit se connecter à l\'utilisateur John Doe', async () => {
                const userData = {
                    email: 'john.doe@example.com',
                    password: 'password123' 
                };

                const response = await request(app)
                    .post('/auth/login')
                    .send(userData);

                expect(response.status).toBe(200);
            });

            it('Doit fail à la connexion car identifiants invalides', async () => {
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

    let server;
    beforeAll((done) => {
        server = app.listen(3030, () => {
            console.log('Serveur démarré sur le port 3030');
            done();
        });
    });

    afterAll((done) => {
        server.close(done);
    });
});
