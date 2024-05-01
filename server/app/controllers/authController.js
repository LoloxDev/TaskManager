/**
 * @module authController
 */

const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

/**
 * Inscription d'un nouvel utilisateur.
 * @param {Object} req
 * @param {Object} res
 * @returns {Promise<void>} 
 * @memberof module:authController
 */
exports.register = async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 10);

    const userData = {
        nom: firstName,
        prenom: lastName,
        email: email,
        password: hashedPassword,
        role: role
    };

    try {
        const existingUser = await userModel.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'Cet email est déjà utilisé', success: false });
        }

        await userModel.addUser(userData);
        console.log('Utilisateur ajouté avec succès !');
        res.redirect('/login?success=true');
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'utilisateur :', error);
        res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'utilisateur', success: false, sqlError: error.sqlMessage });
    }
};

/**
 * Connexion de l'utilisateur.
 * @param {Object} req
 * @param {Object} res
 * @returns {Promise<void>} 
 * @memberof module:authController
 */
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findByEmail(email);

        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.regenerate(function (err) {
                if (err) {
                    console.error('Erreur lors de la régénération de la session :', err);
                    return res.status(500).json({ error: 'Erreur lors de la connexion', success: false });
                }
                req.session.authenticated = true;
                req.session.user = user;
                req.session.save(function (err) {
                    if (err) {
                        console.error('Erreur lors de la sauvegarde de la session :', err);
                        return res.status(500).json({ error: 'Erreur lors de la connexion', success: false });
                    }
                    res.redirect('/taskPanel');
                });
            });
        } else {
            res.status(401).json({ error: 'Identifiants invalides', success: false });
        }
    } catch (error) {
        console.error('Erreur lors de l\'authentification :', error);
        res.status(500).json({ error: 'Erreur lors de la connexion', success: false });
    }
};

/**
 * Déconnexion de l'utilisateur.
 * @param {Object} req
 * @param {Object} res
 * @returns {void}
 * @memberof module:authController
 */
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erreur lors de la déconnexion :', err);
            return res.status(500).json({ error: 'Erreur lors de la déconnexion', success: false });
        }
        res.redirect('/login');
    });
};
