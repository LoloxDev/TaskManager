const { configureUserModelMock, configureTaskModelMock, app } = require('../config/setup');
const taskRoutes = require('../../server/app/routes/taskRoutes');
const session = require('supertest-session');
const authRoutes = require('../../server/app/routes/authRoutes');
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

const testSession = session(app);

// ***************
// ** LIFECYCLE **
// ***************

beforeAll(async () => {
    configureUserModelMock();
    configureTaskModelMock();
});

// ***********
// ** TESTS **
// ***********

describe('Tests des routes de gestion des tâches', () => {

    describe('Recuperation des tâches', () => {

        it('Doit fail et rediriger vers /login car non authentifié', async () => {
            const response = await testSession.get('/tasks/tasks');

            expect(response.status).toBe(302);
            expect(response.header['location']).toBe('/login');
        });

        it('Doit récupérer toutes les tâches de l\'utilisateur', async () => {
            await testSession.post('/auth/login')
                .send({ email: 'john.doe@example.com', password: 'password123' })
                .expect(302);

            const response = await testSession.get('/tasks/tasks');

            expect(response.status).toBe(200);
        });

    });

    // AJOUT D'UNE TACHE
    it('Devrait ajouter une nouvelle tâche pour l\'utilisateur', async () => {
        await testSession.post('/auth/login')
            .send({ email: 'john.doe@example.com', password: 'password123' })
            .expect(302);
    
        const newTask = {
            taskName: 'Nouvelle tâche',
            taskStatus: false
        };
        const response = await testSession.post('/tasks/tasks')
            .send(newTask)
            .expect(200);
    
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Tâche ajoutée avec succès');
    });

    // MODIFICATION D'UNE TACHE
    it('Devrait modifier une tâche existante pour l\'utilisateur', async () => {
        await testSession.post('/auth/login')
            .send({ email: 'john.doe@example.com', password: 'password123' })
            .expect(302);

        const editedTask = {
            taskId: 1,
            taskName: 'Nom_modifié',
            taskStatus: true
        };
        const response = await testSession.put(`/tasks/tasks/${editedTask.taskId}`)
            .send(editedTask)
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Tâche modifiée avec succès');
    });

    // SUPPRESSION D'UNE TACHE
    it('Devrait supprimer une tâche existante pour l\'utilisateur', async () => {
        await testSession.post('/auth/login')
            .send({ email: 'john.doe@example.com', password: 'password123' })
            .expect(302);

        const taskId = 1;
        const response = await testSession.delete(`/tasks/tasks/${taskId}`)
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Tâche supprimée avec succès');
    });
});



