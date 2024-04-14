/**
 * @module userController
 */

const userModel = require('../models/userModel');

/**
 * Récupère un utilisateur par son adresse e-mail.
 * @param {Object} req
 * @param {Object} res
 * @returns {Promise<void>} 
 * @memberof module:userController
 */
exports.getUserByEmail = async (req, res) => {
    const email = req.query.email;

    try {
        const user = await userModel.findByEmail(email);

        if (user) {
            console.log('Utilisateur trouvé avec succès !');
            res.status(200).json(user);
        } else {
            console.log('Aucun utilisateur trouvé avec cette adresse e-mail.');
            res.status(404).json({ error: 'Aucun utilisateur trouvé avec cette adresse e-mail.' });
        }
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur' });
    }
};

/**
 * Récupère l'utilisateur connecté.
 * @param {Object} req
 * @param {Object} res
 * @returns {Promise<void>} 
 * @memberof module:userController
 */
exports.getUserConnected = async (req, res) => {
    try {
        res.status(200).json(req.session.user);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur' });
    }
};

/**
 * Ajoute un nouvel utilisateur.
 * @param {Object} req
 * @param {Object} res
 * @returns {Promise<void>} 
 * @memberof module:userController
 */
exports.addUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        const existingUser = await userModel.findByEmail(email);

        if (existingUser) {
            console.log('Email déjà utilisé');
            return res.status(400).json({ error: 'Cet email est déjà utilisé', success: false });
        }
        
        await userModel.addUser({ firstName, lastName, email, password });
        console.log('Utilisateur ajouté avec succès !');
        res.status(200).json({ message: 'Utilisateur ajouté avec succès', success: true });
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'utilisateur :', error);
        res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'utilisateur', success: false, sqlError: error.sqlMessage });
    }
};
