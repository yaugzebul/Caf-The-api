// Router Commandes
// Chemin : /api/orders
const express = require('express');
const { handleCreateOrder } = require('../controllers/OrderController');
const { verifyToken } = require('../../mddleware/authMiddleware');

const router = express.Router();

/**
 * Route pour créer une nouvelle commande.
 * @route POST /api/orders
 * @description Crée une commande avec les articles fournis. L'utilisateur doit être authentifié.
 * @access private
 * @body {Array<object>} items - Liste des articles de la commande.
 * @body {number} total - Montant total de la commande.
 */
router.post('/', verifyToken, handleCreateOrder);

module.exports = router;
