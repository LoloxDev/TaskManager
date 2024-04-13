// Middleware pour vérifier si l'utilisateur est authentifié
const isAuthenticated = (req, res, next) => {
    if (req.session.authenticated) {
        next();
    } else {
        res.redirect('/login');
        // res.status(401).json({ error: 'Utilisateur non authentifié', success: false });
    }
};

module.exports = isAuthenticated;
