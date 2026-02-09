// Modèle Commandes
const db = require("../../db");

/**
 * Crée une commande dans la base de données avec ses lignes de commande associées.
 * Utilise une transaction pour garantir l'intégrité des données.
 * @param {object} orderData - Les données de la commande.
 * @returns {Promise<object>} - L'ID de la nouvelle commande.
 */
const createOrder = async (orderData) => {
    const { clientId, items, total, moyen_paiement, mode_commande } = orderData;
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [orderResult] = await connection.query(
            `INSERT INTO commande (id_client, date_commande, montant_paiement, statut_commande, mode_commande, moyen_paiement, date_paiement) 
             VALUES (?, NOW(), ?, 'En cours', ?, ?, NOW())`,
            [clientId, total, mode_commande, moyen_paiement]
        );
        const orderId = orderResult.insertId;

        const itemPromises = items.map(item =>
            connection.query(
                "INSERT INTO contenir (id_commande, id_article, quantite_commandee) VALUES (?, ?, ?)",
                [orderId, item.id_article, item.quantite]
            )
        );
        await Promise.all(itemPromises);

        const stockPromises = items.map(item =>
            connection.query(
                "UPDATE produit SET quantite_stock = quantite_stock - ? WHERE id_article = ?",
                [item.quantite, item.id_article]
            )
        );
        await Promise.all(stockPromises);

        await connection.commit();
        return { id: orderId };

    } catch (error) {
        await connection.rollback();
        console.error("Erreur lors de la création de la commande dans le modèle :", error);
        throw error;
    } finally {
        connection.release();
    }
};

/**
 * Trouve une commande par son ID et vérifie qu'elle appartient au bon client.
 * @param {number} orderId - L'ID de la commande.
 * @param {number} clientId - L'ID du client pour la vérification de propriété.
 * @returns {Promise<object|null>} - La commande avec ses articles, ou null si non trouvée ou non autorisée.
 */
const findOrderById = async (orderId, clientId) => {
    const [orders] = await db.query(
        "SELECT * FROM commande WHERE id_commande = ? AND id_client = ?",
        [orderId, clientId]
    );

    if (orders.length === 0) {
        return null;
    }
    const order = orders[0];

    const [items] = await db.query(
        `SELECT 
            p.id_article, p.nom_produit, p.prix_ttc, p.image_url, c.quantite_commandee
         FROM produit p
         INNER JOIN contenir c ON p.id_article = c.id_article
         WHERE c.id_commande = ?`,
        [orderId]
    );

    order.items = items;
    return order;
};

/**
 * Trouve toutes les commandes d'un client spécifique.
 * @param {number} clientId - L'ID du client.
 * @returns {Promise<Array<object>>} - Une liste des commandes avec des détails agrégés.
 */
const findOrdersByClientId = async (clientId) => {
    const [orders] = await db.query(
        `SELECT 
            c.id_commande,
            c.date_commande,
            c.statut_commande,
            c.montant_paiement,
            SUM(cont.quantite_commandee) AS total_articles
         FROM commande c
         JOIN contenir cont ON c.id_commande = cont.id_commande
         WHERE c.id_client = ?
         GROUP BY c.id_commande, c.date_commande, c.statut_commande, c.montant_paiement
         ORDER BY c.date_commande DESC`,
        [clientId]
    );
    return orders;
};

module.exports = { createOrder, findOrderById, findOrdersByClientId };
