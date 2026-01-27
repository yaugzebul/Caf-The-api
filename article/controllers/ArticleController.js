// Controleur Articles
const {getAllArticles, getArticleById} = require("../models/ArticleModel");

// Récupérer tous les articles

const getAll = async (req, res) => {
    try {
        const articles = await getAllArticles();

        res.json({
            message: "Produits récupérés avec succès",
            count: articles.length,
            articles,
        })

    } catch (error) {
        console.error("Erreur de récupération des produits", error.message)
        res.status(500).json({
            message: "Erreur de récupération des produits",
        })
    }
}

// Récupérer un article par son ID
const getById = async (req, res) => {
    try {
        // const id = req.params.id
        const { id } = req.params;
        const articleId = parseInt(id);
        const articles = await getArticleById(articleId);

        if ( articles.lenght === 0){
            return res.status(404).json({
                message: "Produit non trouvé"
            })
        }

        res.json({
            message: "Article récupéré avec succès",
            article:articles[0]
        })

    } catch (error){
        console.error("Erreur de récupération de l'article", error.message);
        res.status(500).json({
            message: "Erreur de récupération de l'article",
        })
    }
}

module.exports = { getAll, getById};