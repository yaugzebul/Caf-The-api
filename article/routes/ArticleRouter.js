// Router Articles
// Chemin : /api/articles
const express = require('express');

const { getAll, getById, getByCategory, getTopSelling } = require("../controllers/ArticleController");
const { verifyToken } = require("../../mddleware/authMiddleware");
const router = express.Router();

// GET /api/articles/top-selling - Récupérer les articles les plus vendus
// Note : Cette route est placée avant '/:id' pour éviter que 'top-selling' soit interprété comme un ID.
router.get("/top-selling", getTopSelling);

// GET /api/articles - Récupérer tous les articles (protégé)
router.get("/", getAll);

// GET /api/articles/:id - Récupérer un article par son ID
router.get("/:id", getById);

// GET /api/articles/categorie/:categorie - Récupérer les articles par une catégorie
router.get("/categorie/:categorie", getByCategory);

module.exports = router;
