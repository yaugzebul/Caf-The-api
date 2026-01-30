// Router Articles
// Chemin : /api/articles
const express = require('express');

const {getAll, getById, getByCategory} = require("../controllers/ArticleController");
const router = express.Router();

// GET /api/articles - Récupérer tous les articles
router.get("/", getAll);

// GET /api/articles/:id || Récupérer un article par son ID
router.get("/:id", getById);

// GET /api/articles:categorie - Récupérer les articles par une catégorie
router.get( "/categorie/:categorie", getByCategory);

module.exports = router;