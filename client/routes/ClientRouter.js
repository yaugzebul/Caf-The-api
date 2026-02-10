// Router Clients...
// Chemin : /api/clients

const express = require("express");
const { register, getMe, logout} = require("../controllers/ClientController");
const router = express.Router();
const { login } = require("../controllers/ClientController");
const {verifyToken} = require("../../mddleware/authMiddleware");

// Vérification de session du client
// Route protégée
// GET /api/clients/me
router.get("/me", verifyToken, getMe)

// Déconnexion
// Route protégée
// POST /api/clients/logout
router.post("/logout", logout)

// Inscription d'un client
// POST /api/clients/register
// Body : { nom, prenom, email, mot_de_passe }
router.post("/register", register);

// Connexion
// POST /api/clients/login
// Body : { email, mot_de_passe }
// Retourner un token JWT
router.post("/login", login);

module.exports = router;
