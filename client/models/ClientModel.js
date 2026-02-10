// Modèle Clients

const db = require("../../db");
const bcrypt = require("bcryptjs");

// AJOUT - nouvelle fonction
// Rechercher un client par son ID
const findClientById = async (id) => {
    const [rows] = await db.query(
        "SELECT * FROM client WHERE id_client = ?",
        [id]
    );
    return rows;
};

// Rechercher un client par email
const findClientByEmail = async (email) => {
    const [rows] = await db.query(
        "SELECT * FROM client WHERE email_client = ?",
        [email],
        );
    return rows;
}

// Créer un nouveau client
const createClient = async (clientData) => {
    const {
        nom,
        prenom,
        email,
        adresse_facturation,
        cp_facturation,
        ville_facturation,
        adresse_livraison,
        cp_livraison,
        ville_livraison,
        telephone,
        mot_de_passe
    } = clientData;


    const [result] = await db.query(
        `INSERT INTO client (nom_client, prenom_client, email_client,  mdp_client, tel_client,
                             adresse_facturation, cp_facturation, ville_facturation,
                             adresse_livraison, cp_livraison, ville_livraison)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nom,
            prenom,
            email,
            mot_de_passe,
            adresse_facturation || null,
            cp_facturation || null,
            ville_facturation || null,
            adresse_livraison || null,
            cp_livraison || null,
            ville_livraison || null,
            telephone || null

        ],
    )
    return result;
}

// Hacher le mot de passe
const hashPassword = async (password) => {
    const rounds = parseInt( process.env.BCRYPT_ROUNDS)  || 10
    return await bcrypt.hash(password, rounds)
}



// Comparer un mot de passe
const comparePassword= async (password, hash) => {
    return await bcrypt.compare(password, hash)
}
module.exports = {findClientByEmail,createClient, hashPassword, comparePassword, findClientById};

// {
//    "nom":"Testaert",
//    "prenom":"Romain",
//    "email":"contact.rtestaert.fr",
//    "mot_de_passe":"romain1234"
// }