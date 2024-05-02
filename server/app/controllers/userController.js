/**
 * @module userController
 */

const userModel = require('../models/userModel');

/**
 * Récupère un utilisateur par son adresse e-mail.
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns {Promise<void>} 
 * @memberof module:userController
 */
exports.getUserByEmail = async (req, res, next) => {
    const email = req.query.email;

    try {
        const user = await userModel.findByEmail(email);

        if (user) {
            console.log('Utilisateur trouvé avec succès !');
            res.status(200).json(user);
        } else {
            const error = new Error('Aucun utilisateur trouvé avec cette adresse e-mail.');
            error.status = 404;
            return next(error);
        }
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur :', error);
        next(error);
    }
};

/**
 * Récupère l'utilisateur connecté.
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns {Promise<void>} 
 * @memberof module:userController
 */
exports.getUserConnected = async (req, res, next) => {
    try {
        console.log(req.session.user);
        res.status(200).json({ user: req.session.user });
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur :', error);
        next(error);
    }
};

/**
 * Ajoute un nouvel utilisateur.
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns {Promise<void>} 
 * @memberof module:userController
 */
exports.addUser = async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        const existingUser = await userModel.findByEmail(email);

        if (existingUser) {
            console.log('Email déjà utilisé');
            const error = new Error('Cet email est déjà utilisé');
            error.status = 400;
            return next(error);
        }
        
        await userModel.addUser({ firstName, lastName, email, password });
        console.log('Utilisateur ajouté avec succès !');
        res.status(200).json({ message: 'Utilisateur ajouté avec succès', success: true });
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'utilisateur :', error);
        next(error);
    }
};
