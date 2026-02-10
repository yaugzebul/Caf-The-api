const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// connexion à la bdd
const db = require('./db');
const {listen} = require("express/lib/application");

// Importation des routes
// Route des Articles
const articleRoutes = require("./article/routes/ArticleRouter");
const clientRoutes = require("./client/routes/ClientRouter");
const orderRoutes = require("./order/routes/OrderRouter");

// Création de l'appli express
const app = express();

// MIDDLEWARES
// Parser les JSON
app.use(express.json());

// Logger de requêtes HTTP dans la console
app.use(morgan('dev'));

// Sert les fichiers statiques (images et produits)
app.use(express.static( "public"));

// Permet les requêtes cross origin (qui viennent du front)
// CORS = Cross Origin Ressource Sharing
// Obligatoire sinon le navigateur bloque les requêtes

app.use(cors( {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}),
    );

// Parser les cookies dans req
app.use(cookieParser());

// ROUTES

// Route de test pour vérifier que l'api fonctionne
app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        message: "API fonctionnel",
    })
})

// Routes de l'api
app.use("/api/articles", articleRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/orders", orderRoutes);

// Gestion des erreurs
// Route 404
app.use((req, res) => {
    res.status(404).json({
        message: "Route non trouvée",

    })
})


// Démarrage du serveur
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

app.listen(port, host,() => {
    console.log(`Serveur démarré sur http://${host}:${port}`)
})