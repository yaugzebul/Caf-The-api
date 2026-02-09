// Contrôleur Commandes
const { createOrder, findOrderById, findOrdersByClientId } = require("../models/OrderModel");

/**
 * Gère la création d'une nouvelle commande.
 * @param {object} req - L'objet de la requête Express.
 * @param {object} res - L'objet de la réponse Express.
 */
const handleCreateOrder = async (req, res) => {
    try {
        const { items, total, moyen_paiement } = req.body;
        const clientId = req.client.id;

        if (!items || !Array.isArray(items) || items.length === 0 || !total || !moyen_paiement) {
            return res.status(400).json({ message: "Les données de la commande sont incomplètes. 'items', 'total' et 'moyen_paiement' sont requis." });
        }

        const orderData = {
            clientId,
            items,
            total,
            moyen_paiement,
            mode_commande: 'Web'
        };

        const newOrder = await createOrder(orderData);

        res.status(201).json({
            message: "Commande créée avec succès !",
            orderId: newOrder.id,
        });

    } catch (error) {
        console.error("Erreur lors de la création de la commande dans le contrôleur :", error);
        res.status(500).json({ message: "Une erreur est survenue lors de la création de la commande." });
    }
};

/**
 * Gère la récupération d'une commande par son ID.
 * @param {object} req - L'objet de la requête Express.
 * @param {object} res - L'objet de la réponse Express.
 */
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const orderId = parseInt(id);
        const clientId = req.client.id;

        const order = await findOrderById(orderId, clientId);

        if (!order) {
            return res.status(404).json({ message: "Commande non trouvée ou accès non autorisé." });
        }

        res.json({
            message: "Commande récupérée avec succès",
            order,
        });

    } catch (error) {
        console.error("Erreur lors de la récupération de la commande :", error);
        res.status(500).json({ message: "Une erreur est survenue lors de la récupération de la commande." });
    }
};

/**
 * Gère la récupération de toutes les commandes d'un client.
 * @param {object} req - L'objet de la requête Express.
 * @param {object} res - L'objet de la réponse Express.
 */
const getClientOrders = async (req, res) => {
    try {
        const clientId = req.client.id; // ID de l'utilisateur authentifié
        const orders = await findOrdersByClientId(clientId);

        res.json({
            message: "Historique des commandes récupéré avec succès",
            orders,
        });

    } catch (error) {
        console.error("Erreur lors de la récupération de l'historique des commandes :", error);
        res.status(500).json({ message: "Une erreur est survenue lors de la récupération des commandes." });
    }
};

module.exports = { handleCreateOrder, getOrderById, getClientOrders };
