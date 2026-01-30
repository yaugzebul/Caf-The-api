// Controleur Clients

const {
    createClient,
    findClientByEmail,
    hashPassword,
    comparePassword} = require("../models/ClientModel");
const jwt = require("jsonwebtoken");

// Inscription
const register = async (req, res) => {
    try {
        const { nom, prenom, email, mot_de_passe } = req.body;

        //Verifier si l'email existe déja
        const existingClient = await findClientByEmail(email);

        if (existingClient.length > 0) {
            return res.status(400).json({
                message: "Cet email est déja utilisé",
            })
        }

        //Hacher le mot de passe
        const hash = await hashPassword(mot_de_passe);

        // Créer le client
        const result = await createClient({
            nom,
            prenom,
            email,
            mot_de_passe:hash,
        })

        res.status(201).json({
            message: "Inscription réussie",
            client_id: result.insertId,
            client: { nom, prenom, email },
        })
        } catch (error) {
        console.error("Erreur d'inscription", error.message);
        res.status(500).json({
            message: "Erreur lors de l'inscription",
        })
    }
}

//Connexion
const login = async (req, res) => {
    try {
        const {email, mot_de_passe} = req.body;

        // Rechercher un client par email
        const clients = await findClientByEmail(email);

        if (clients.length === 0) {
            return res.status(401).json({
                message: "Identifiant incorrect",
            })
        }

        const client = clients[0];

        // Vérifier le mot de passe
        const isMatch = await comparePassword(mot_de_passe, client.mdp_client);

        if (!isMatch) {
            return res.status(401).json({
                message: "Identifiants incorrects",
            })
        }

        // Générer le token JWT
        const token = jwt.sign(
            {
                id: client.id_client,
                email: client.email_client,
            },
            process.env.JWT_SECRET,
            {expiresIn: process.env.EXPIRES_IN || "1h"},
        )
        res.json({
            message: "Connexion réussie",
            token,
            client: {
                id: client.id_client,
                nom: client.nom_client,
                prenom: client.prenom_client,
                email: client.email_client,
            },
        });
    } catch (error) {
        console.error("Erreur de connexion utilisateur", error.message);
        res.status(500).json({
            message: "Erreur lors de la connexion",
        })
    }
};
module.exports = {register, login};