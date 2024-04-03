const request = require('supertest');
const { configureUserModelMock, configureTaskModelMock, app } = require('../config/setup');
const taskRoutes = require('../../server/app/routes/taskRoutes');
const session = require('supertest-session');
const authRoutes = require('../../server/app/routes/authRoutes');

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

// Injecter l'application express dans supertest-session
const testSession = session(app);

// Avant chaque test, configurer le mock de user & tasks
beforeAll(async () => {
    configureUserModelMock();
    configureTaskModelMock();
});

describe('Tests des routes de gestion des tâches', () => {

    it('Doit récupérer toutes les tâches de l\'utilisateur', async () => {
        // Se connecter
        await testSession.post('/auth/login')
            .send({ email: 'john.doe@example.com', password: 'password123' })
            .expect(302);

        // Récupérer les tâches
        const response = await testSession.get('/tasks/tasks');

        // Vérifier le statut de la réponse
        expect(response.status).toBe(200);

    });
});
