const session = require('supertest-session');
const { configureUserModelMock, app, loginUser } = require('../config/setup');
const authRoutes = require('../../server/app/routes/authRoutes');
const userRoutes = require('../../server/app/routes/userRoutes');
const userModel = require('../../server/app/models/userModel');

app.use('/auth', authRoutes);
app.use('/user', userRoutes);

// ***************
// ** LIFECYCLE **
// ***************

beforeAll(async () => {
    configureUserModelMock();
});

afterEach(() => {
    jest.clearAllMocks();
});

let testSession;

beforeEach(() => {
    testSession = session(app);
});

// ***********
// ** TESTS **
// ***********

describe('Tests des routes d\'authentification', () => {

    describe('Inscription', () => {
        it('Doit inscrire un utilisateur Alice', async () => {
            const userData = {
                firstName: 'Alice',
                lastName: 'Smith',
                email: 'alice.smith@example.com',
                password: 'password123',
                role: 'super'
            };
            const response = await testSession
                .post('/auth/register')
                .send(userData);
            expect(response.status).toBe(302);
        });

        it('Doit échouer car même email', async () => {
            const userData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'password123',
                role: 'super'
            };
            const response = await testSession
                .post('/auth/register')
                .send(userData);
            expect(response.status).toBe(400);
            expect(response.headers.location).toBeUndefined();
        });
    });

    describe('Connexion', () => {
        it('Doit se connecter à l\'utilisateur John Doe', async () => {
            const loginResponse = await loginUser(testSession, 'john.doe@example.com', 'password123');

            expect(userModel.findByEmail).toHaveBeenCalledWith('john.doe@example.com');

            expect(loginResponse.status).toBe(302);
            expect(loginResponse.header['set-cookie']).toBeDefined();
            expect(loginResponse.header['location']).toBe('/taskPanel');

            const userResponse = await testSession.get('/user/whoAmI');

            expect(userResponse.body.user.email).toBe('john.doe@example.com');
        });

        it('Doit échouer car identifiants invalides', async () => {
            const response = await loginUser(testSession, 'john.doe@example.com', 'wrongpassword');

            expect(userModel.findByEmail).toHaveBeenCalledWith('john.doe@example.com');

            expect(response.status).toBe(401);
            expect(response.header['set-cookie']).toBeUndefined();
        });
    });

    describe('Déconnexion', () => {
        it('Doit se déconnecter de l\'utilisateur', async () => {
            await loginUser(testSession, 'john.doe@example.com', 'password123');
            const response = await testSession.get('/auth/logout');
            expect(response.status).toBe(302);
            expect(response.header['location']).toBe('/login');
            expect(response.header['set-cookie']).toBeUndefined();
        });
    });
});
