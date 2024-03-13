const dbConnection = require('../../config/db'); // Importez la connexion à la base de données depuis votre configuration
const bcrypt = require('bcrypt');

// Rechercher un utilisateur par son adresse e-mail
exports.findByEmail = async (email) => {
    try {
        const user = await dbConnection('users').where('email', email).first();
        return user;
    } catch (error) {
        console.error('Erreur lors de la recherche de l\'utilisateur par email :', error);
        throw new Error('Erreur lors de la recherche de l\'utilisateur par email');
    }
};

// Ajouter un nouvel utilisateur à la base de données
exports.addUser = async ({ nom, prenom, email, password }) => {

    try {
        await dbConnection('users').insert({ nom, prenom, email, password });
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'utilisateur :', error);
        throw new Error('Erreur lors de l\'ajout de l\'utilisateur');
    }
};

