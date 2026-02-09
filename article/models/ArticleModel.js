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

// Récupérer les 3 articles les plus vendus
const getTopSellingArticles = async () => {
    const [rows] = await db.query(`
        SELECT
            p.id_article,
            p.nom_produit,
            p.prix_ttc,
            p.image_url,
            SUM(c.quantite_commandee) AS total_vendu
        FROM
            produit p
                JOIN
            contenir c ON p.id_article = c.id_article
        GROUP BY
            p.id_article,
            p.nom_produit,
            p.prix_ttc,
            p.image_url
        ORDER BY
            total_vendu DESC
            LIMIT 3;
    `);
    return rows;
};

module.exports = { getAllArticles, getArticleById, getArticleByCategory, getTopSellingArticles };
