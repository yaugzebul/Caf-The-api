// Router Clients...
// Chemin : /api/clients

const express = require("express");
const { register, getMe, logout, updateProfile, changePassword } = require("../controllers/ClientController");
const router = express.Router();
const { login } = require("../controllers/ClientController");
const {verifyToken} = require("../../mddleware/authMiddleware");

// Vérification de session du client
// Route protégée
// GET /api/clients/me
router.get("/me", verifyToken, getMe)

// Mise à jour du profil client
// Route protégée
// PUT /api/clients/me
router.put("/me", verifyToken, updateProfile);

// Changement de mot de passe
// Route protégée
// PUT /api/clients/password
router.put("/password", verifyToken, changePassword);

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
