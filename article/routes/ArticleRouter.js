// Router Articles
// Chemin : /api/articles
const express = require('express');

const {getAll, getById} = require("../controllers/ArticleController");
const router = express.Router();

// GET /api/articles - Récupérer tous les articles
router.get("/", getAll);

// GET /api/articles/:id || Récupérer un article par son ID
router.get("/:id", getById);

module.exports = router;