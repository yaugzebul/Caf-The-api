// Modèle Commandes
const db = require("../../db");

// Récupérer la liste des commandes d'un utilisateur
const getOrdersByUserId = async (userId) => {
    const [rows] = await db.query(
        "SELECT * FROM commande WHERE id_client = ?",
        [userId]
    );
    return rows;
};

// Récupérer une commande par son ID
const getOrderById = async (orderId) => {
    const [rows] = await db.query(
        "SELECT * FROM commande WHERE id_commande = ?",
        [orderId]
    )}

// Récupérer les articles d'une commande
const getItemsByOrderId = async (orderId) => {
    const [rows] = await db.query(
        "SELECT * FROM contenir WHERE id_commande = ?",
        [orderId]
    )}


/**
 * Crée une commande dans la base de données avec ses lignes de commande associées.
 * Utilise une transaction pour garantir l'intégrité des données.
 * @param {object} orderData - Les données de la commande.
 * @param {number} orderData.clientId - L'ID du client qui passe la commande.
 * @param {Array<object>} orderData.items - Les articles de la commande.
 * @param {number} orderData.total - Le montant total de la commande.
 * @param {string} orderData.moyen_paiement - Le moyen de paiement utilisé.
 * @param {string} orderData.mode_commande - Le mode de la commande (ex : 'Web').
 * @returns {Promise<object>} - L'ID de la nouvelle commande.
 */
const createOrder = async (orderData) => {
    const { clientId, items, total, moyen_paiement, mode_commande } = orderData;
    const connection = await db.getConnection(); // Récupère une connexion du pool

    try {
        await connection.beginTransaction(); // Démarre la transaction

        // 1. Insérer la commande principale dans la table 'commande' avec les nouvelles informations
        const [orderResult] = await connection.query(
            `INSERT INTO commande (id_client, date_commande, montant_paiement, statut_commande, mode_commande, moyen_paiement, date_paiement) 
             VALUES (?, NOW(), ?, 'En cours', ?, ?, NOW())`,
            [clientId, total, mode_commande, moyen_paiement]
        );

        const orderId = orderResult.insertId;

        // 2. Insérer chaque article dans la table 'contenir'
        const itemPromises = items.map(item => {
            return connection.query(
                "INSERT INTO contenir (id_commande, id_article, quantite_commandee) VALUES (?, ?, ?)",
                [orderId, item.id_article, item.quantite]
            );
        });

        await Promise.all(itemPromises);

        // 3. Mettre à jour le stock des produits
        const stockPromises = items.map(item => {
            return connection.query(
                "UPDATE produit SET quantite_stock = quantite_stock - ? WHERE id_article = ?",
                [item.quantite, item.id_article]
            );
        });

        await Promise.all(stockPromises);

        await connection.commit(); // Valide la transaction
        return { id: orderId };

    } catch (error) {
        await connection.rollback(); // Annule la transaction en cas d'erreur
        console.error("Erreur lors de la création de la commande dans le modèle :", error);
        throw error; // Propage l'erreur pour que le contrôleur puisse la gérer
    } finally {
        connection.release(); // Libère la connexion pour qu'elle puisse être réutilisée
    }
};

module.exports = { createOrder, getOrdersByUserId, getOrderById, getItemsByOrderId };
