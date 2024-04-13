const userModel = require('../models/userModel');

// DRAFT -- SERVIRA PEUT ETRE AUX ADMINS A AJOUTER UN UTILISATEUR


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

// Récupérer l'objet user connecté
exports.getUserConnected = async (req, res) => {
    try {
        res.status(200).json(req.session.user);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur' });
    }
};

// Ajouter un nouvel utilisateur
exports.addUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        // Vérifier si l'email existe déjà en base
        const existingUser = await userModel.findByEmail(email);

        if (existingUser) {
            // L'email existe déjà, renvoyer un message d'erreur
            console.log('Email déjà utilisé');
            return res.status(400).json({ error: 'Cet email est déjà utilisé', success: false });
        }

        // L'email n'existe pas, ajouter l'utilisateur
        await userModel.addUser({ firstName, lastName, email, password });
        console.log('Utilisateur ajouté avec succès !');
        res.status(200).json({ message: 'Utilisateur ajouté avec succès', success: true });
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'utilisateur :', error);
        res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'utilisateur', success: false, sqlError: error.sqlMessage });
    }
};
