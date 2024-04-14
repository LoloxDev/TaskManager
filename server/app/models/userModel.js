/**
 * @module userModel
 */

const dbConnection = require('../../config/db');

/**
 * Recherche un utilisateur par son adresse e-mail.
 * @param {string} email
 * @returns {Promise<Object|null>}
 * @memberof module:userModel
 */
exports.findByEmail = async (email) => {
    try {
        const user = await dbConnection('users').where('email', email).first();
        return user;
    } catch (error) {
        console.error('Erreur lors de la recherche de l\'utilisateur par email :', error);
        throw new Error('Erreur lors de la recherche de l\'utilisateur par email');
    }
};

/**
 * Ajoute un nouvel utilisateur à la base de données.
 * @param {Object} userData
 * @param {string} userData.nom
 * @param {string} userData.prenom
 * @param {string} userData.email
 * @param {string} userData.password
 * @returns {Promise<void>}
 * @memberof module:userModel
 */
exports.addUser = async ({ nom, prenom, email, password }) => {
    try {
        await dbConnection('users').insert({ nom, prenom, email, password });
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'utilisateur :', error);
        throw new Error('Erreur lors de l\'ajout de l\'utilisateur');
    }
};
