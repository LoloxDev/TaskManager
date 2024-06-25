/**
 * @module userController
 */

const bcrypt = require('bcrypt');
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

    if (!email || typeof email !== 'string' || email.trim().length === 0) {
        const error = new Error('Adresse e-mail invalide');
        error.status = 400;
        return next(error);
    }

    try {
        const user = await userModel.findByEmail(email.trim());

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
        if (!req.session.user) {
            const error = new Error('Aucun utilisateur connecté');
            error.status = 401;
            return next(error);
        }

        console.log(req.session.user);
        res.status(200).json({ user: req.session.user });
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur connecté :', error);
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

    if (!firstName || typeof firstName !== 'string' || firstName.trim().length === 0) {
        const error = new Error('Prénom invalide');
        error.status = 400;
        return next(error);
    }
    if (!lastName || typeof lastName !== 'string' || lastName.trim().length === 0) {
        const error = new Error('Nom invalide');
        error.status = 400;
        return next(error);
    }
    if (!email || typeof email !== 'string' || email.trim().length === 0) {
        const error = new Error('Adresse e-mail invalide');
        error.status = 400;
        return next(error);
    }
    if (!password || typeof password !== 'string' || password.trim().length === 0) {
        const error = new Error('Mot de passe invalide');
        error.status = 400;
        return next(error);
    }

    const hashedPassword = bcrypt.hashSync(password.trim(), 10);

    try {
        const existingUser = await userModel.findByEmail(email.trim());

        if (existingUser) {
            console.log('Email déjà utilisé');
            const error = new Error('Cet email est déjà utilisé');
            error.status = 400;
            return next(error);
        }

        await userModel.addUser({ firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim(), password: hashedPassword });
        console.log('Utilisateur ajouté avec succès !');
        res.status(200).json({ message: 'Utilisateur ajouté avec succès', success: true });
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'utilisateur :', error);
        next(error);
    }
};
