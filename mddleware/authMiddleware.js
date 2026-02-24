// Middleware d'authentification JWT - authMiddleware.js
// Vérifie que le token est valide pour protéger les routes

const jwt = require('jsonwebtoken');

// Vérification du token
const verifyToken = (req, res, next) => {
    // 1. Chercher le token dans les cookies (priorité aux cookies pour le front)
    let token = req.cookies.token;

    // 2. Si pas de cookie, chercher dans le header Authorization (pour Postman/Mobile)
    if (!token) {
        const authHeader = req.headers['authorization'];
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }
    }

    // Si aucun token n'est trouvé nulle part
    if (!token) {
        return res.status(403).json({
            message: "Token manquant ou invalide",
        });
    }

    // Vérifier le token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log(err);
            if (err.name === "TokenExpiredError"){
                return res.status(401).json({
                    message:"Token expiré"
                })
            }

            return res.status(401).json({
                message:"Token invalide",
            })
        }

        // Token valide : on ajoute les infos du client à la requête
        req.client = decoded;
        next();
    })
}

module.exports = { verifyToken };