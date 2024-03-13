const dbConnection = require('../../config/db'); // Importez la connexion à la base de données depuis votre configuration
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

// Fonction pour l'inscription d'un nouvel utilisateur
exports.register = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    console.log(password)
    const hashedPassword = bcrypt.hashSync(password, 10); // Hachage du mot de passe
    console.log(hashedPassword)

    const userData = {
        nom: firstName,
        prenom: lastName,
        email: email,
        password: hashedPassword
    };

    try {
        // Vérifier si l'email existe déjà en base
        const existingUser = await userModel.findByEmail(email);
        if (existingUser) {
            // L'email existe déjà, renvoyer un message d'erreur
            console.log('Email déjà utilisé');
            return res.status(400).json({ error: 'Cet email est déjà utilisé', success: false });
        }

        // L'email n'existe pas, ajouter l'utilisateur
        await userModel.addUser({ userData });
        console.log('Utilisateur ajouté avec succès !');
        res.status(200).json({ message: 'Utilisateur ajouté avec succès', success: true });
        res.redirect('/login');
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'utilisateur :', error);
        res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'utilisateur', success: false, sqlError: error.sqlMessage });
    }
};

// Fonction de connexion de l'utilisateur
exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body)
    console.log(email, password)

    try {
        // Recherchez l'utilisateur dans la base de données
        const user = await userModel.findByEmail(email);

        // Vérifiez si l'utilisateur existe et si le mot de passe est correct
        if (user && bcrypt.compareSync(password, user.password)) {
            // Initialisez la session et redirigez l'utilisateur
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
                    res.redirect('/taskPanel.html');
                });
            });
        } else {
            // Identifiants invalides, renvoyer un message d'erreur
            res.status(401).json({ error: 'Identifiants invalides', success: false });
        }
    } catch (error) {
        console.error('Erreur lors de l\'authentification :', error);
        res.status(500).json({ error: 'Erreur lors de la connexion', success: false });
    }
};

// Fonction de déconnexion de l'utilisateur
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erreur lors de la déconnexion :', err);
            return res.status(500).json({ error: 'Erreur lors de la déconnexion', success: false });
        }
        res.redirect('/login');
    });
};
