// Controller Clients

const {
    createClient,
    findClientByEmail,
    hashPassword,
    comparePassword,
    findClientById
} = require("../models/ClientModel");
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
        const expire = parseInt(process.env.JWT_EXPIRES_IN, 10) || 3600;
        const token = jwt.sign(
            {
                id: client.id_client,
                email: client.email_client,
            },
            process.env.JWT_SECRET,
           //  {expiresIn: process.env.EXPIRES_IN || "1h"},
        )
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: expire * 1000,
        });

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

const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false, // Mettre sur true en HTTPS
        sameSite: "lax"
    });
    res.json({ message: "Déconnexion réussie" });
};
// Automatiquement, le navigateur envoie le cookie
// Le Middleware vérifie le JWT
// Si le token est valide, on retourne les infos du client.
const getMe = async (req, res) => {
    try {
        // req.client.id vient du JWT decode par le middleware verifyToken
        const clients = await findClientById(req.client.id);

        if (clients.length === 0) {
            return res.status(404).json({ message: "Client introuvable" });
        }

        const client = clients[0];

        res.json({
            client: {
                id: client.id_client,
                nom: client.nom_client,
                prenom: client.prenom_client,
                email: client.email_client
            }
        });
    } catch (error) {
        console.error("Erreur /me:", error.message);
        res.status(500).json({ message: "Erreur lors de la vérification de session" });
    }
};

module.exports = {register, login, logout, getMe};