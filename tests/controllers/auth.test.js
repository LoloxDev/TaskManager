const request = require('supertest');
const { startServer, configureUserModelMock, closeServer, app } = require('../config/setup'); 
const authRoutes = require('../../server/app/routes/authRoutes');

let server;

app.use('/auth', authRoutes);

// ***************
// ** LIFECYCLE **
// ***************

beforeAll(async () => {
    server = await startServer();
    configureUserModelMock();
});

afterAll(async () => {
    await closeServer(server);
});

// ***********
// ** TESTS **
// ***********

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

        it('Doit échouer car même email', async () => {
            const userData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'password123'
            };
            const response = await request(app)
                .post('/auth/register')
                .send(userData);
            expect(response.status).toBe(400);
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
            expect(response.header['set-cookie']).toBeDefined();
            expect(response.header['location']).toBe('/taskPanel');
        });

        it('Doit échouer car identifiants invalides', async () => {
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

    describe('Déconnexion', () => {
        it('Doit se déconnecter de l\'utilisateur', async () => {
            const response = await request(app).get('/auth/logout');
            expect(response.status).toBe(302);
            expect(response.header['location']).toBe('/login');
            expect(response.header['set-cookie']).toBeUndefined();
        });
    });
});
