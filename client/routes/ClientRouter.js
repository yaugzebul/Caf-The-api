// Router Clients...
// Chemin : /api/clients

const express = require("express");
const { register } = require("../controllers/ClientController");
const router = express.Router();
const { login } = require("../controllers/ClientController");

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
