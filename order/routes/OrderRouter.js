// Router Commandes
// Chemin : /api/orders
const express = require('express');
const { handleCreateOrder, getOrderById, getClientOrders } = require('../controllers/OrderController');
const { verifyToken } = require('../../mddleware/authMiddleware');

const router = express.Router();

/**
 * Route pour récupérer l'historique des commandes de l'utilisateur authentifié.
 * @route GET /
 * @access private
 */
router.get('/', verifyToken, getClientOrders);

/**
 * Route pour créer une nouvelle commande.
 * @route POST /
 * @access private
 */
router.post('/', verifyToken, handleCreateOrder);

/**
 * Route pour récupérer une commande spécifique par son ID.
 * @route GET /:id
 * @access private
 */
router.get('/:id', verifyToken, getOrderById);

module.exports = router;
