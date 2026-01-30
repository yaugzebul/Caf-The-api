// Modèle Articles

const db = require("../../db");

// Récupérer tous les produits
const getAllArticles = async () => {
    const [rows] = await db.query("Select * FROM produit");
    return rows;
};

// Récupérer un article par son ID
const getArticleById = async (id) => {
    const [rows] = await db.query("Select * FROM produit WHERE id_article = ? ", [id]);
    return rows;
}

// Récupérer un article par sa catégorie
const getArticleByCategory = async (categorie) => {
    const [rows] = await db.query("SELECT * FROM produit WHERE id_categorie = ?", [categorie,])
    return rows;
}


module.exports = { getAllArticles, getArticleById, getArticleByCategory };