/**
 * @module authController
 */

const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

/**
 * Inscription d'un nouvel utilisateur.
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns {Promise<void>} 
 * @memberof module:authController
 */
exports.register = async (req, res, next) => {
    const { firstName, lastName, email, password, role } = req.body;

    if (!firstName || !lastName || !email || !password || !role) {
        const error = new Error('Tous les champs doivent être remplis');
        error.status = 400;
        return next(error);
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const userData = {
        nom: firstName.trim(),
        prenom: lastName.trim(),
        email: email.trim(),
        password: hashedPassword,
        role: role.trim()
    };

    try {
        const existingUser = await userModel.findByEmail(email);
        if (existingUser) {
            const error = new Error('Cet email est déjà utilisé');
            error.status = 400;
            return next(error);
        }

        await userModel.addUser(userData);
        console.log('Utilisateur ajouté avec succès !');
        res.redirect('/login?success=true');
    } catch (error) {
        next(error);
    }
};

/**
 * Connexion de l'utilisateur.
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns {Promise<void>} 
 * @memberof module:authController
 */
exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        const error = new Error('Email et mot de passe sont requis');
        error.status = 400;
        return next(error);
    }

    try {
        const user = await userModel.findByEmail(email);

        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.regenerate(function (err) {
                if (err) {
                    console.error('Erreur lors de la régénération de la session :', err);
                    return next(err);
                }
                req.session.authenticated = true;
                req.session.user = user;
                req.session.save(function (err) {
                    if (err) {
                        console.error('Erreur lors de la sauvegarde de la session :', err);
                        return next(err);
                    }
                    res.redirect('/taskPanel');
                });
            });
        } else {
            const error = new Error('Identifiants invalides');
            error.status = 401;
            next(error);
        }
    } catch (error) {
        next(error);
    }
};

/**
 * Déconnexion de l'utilisateur.
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns {void}
 * @memberof module:authController
 */
exports.logout = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erreur lors de la déconnexion :', err);
            return next(err);
        }
        res.redirect('/login');
    });
};
