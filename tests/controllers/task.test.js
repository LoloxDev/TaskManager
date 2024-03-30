const request = require('supertest');
const { startServer, configureUserModelMock, closeServer, app, loginUser } = require('../config/setup');
const taskRoutes = require('../../server/app/routes/taskRoutes');

let server;

app.use('/tasks', taskRoutes);

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

describe('Tests des routes de gestion des tâches', () => {

    let agent;

    beforeEach(async () => {
        agent = await loginUser('john.doe@example.com', 'password123');
        console.log(agent)
    });


    describe('Récupérer toutes les tâches de l\'utilisateur', () => {
        it('Doit récupérer toutes les tâches de l\'utilisateur', async () => {

            const response = await agent.get('/tasks/tasks');

            expect(response.status).toBe(200);
            // Vérifier la structure des données retournées si nécessaire
            // expect(response.body).toEqual(/* Structure de données attendue */);
        });
    });

    // Ajoutez des tests similaires pour les fonctions restantes (éditer une tâche, supprimer une tâche)
});
