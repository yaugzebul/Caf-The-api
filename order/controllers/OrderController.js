// Contrôleur Commandes
const { createOrder } = require("../models/OrderModel");

/**
 * Gère la création d'une nouvelle commande.
 * @param {object} req - L'objet de la requête Express.
 * @param {object} res - L'objet de la réponse Express.
 */
const handleCreateOrder = async (req, res) => {
    try {
        // On récupère maintenant le moyen de paiement depuis le corps de la requête
        const { items, total, moyen_paiement } = req.body;
        // L'ID du client est ajouté à la requête par le middleware `verifyToken`
        const clientId = req.client.id;

        // Vérification des données, on inclut le moyen de paiement
        if (!items || !Array.isArray(items) || items.length === 0 || !total || !moyen_paiement) {
            return res.status(400).json({ message: "Les données de la commande sont incomplètes. 'items', 'total' et 'moyen_paiement' sont requis." });
        }

        // Création de l'objet de commande à passer au modèle
        const orderData = {
            clientId,
            items,
            total,
            moyen_paiement,
            mode_commande: 'Web' // On définit le mode par défaut
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

module.exports = { handleCreateOrder };
