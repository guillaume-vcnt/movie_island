// Importation des modules nécessaires :
import express from "express";
import cors from "cors";
import routes from "./routes.js";
import auth from "./auth.js";
import dotenv from "dotenv";

// Chargement des variables d'environnement depuis le fichier .env :
dotenv.config();

// Définition du port d'écoute (issu du fichier .env ou par défaut 3001) :
const port = process.env.PORT || 3001;

// Initialisation de l'application Express :
const app = express();

// Définir les options CORS :
const corsOptions = {
  origin: "http://localhost:4000", // Autorise uniquement ce domaine
  methods: ["GET", "POST"], // Autorise uniquement GET et POST
  allowedHeaders: ["Content-Type", "Authorization"], // Autorise ces headers
};

//Middleware Cors :
app.use(cors(corsOptions)); // Active le middleware CORS avec les options spécifiées pour permettre ou restreindre l'accès à l'API depuis un domaine externe
app.options("*", cors(corsOptions)); // Gérer les préflight requests (Options)

// Middleware Express :
app.use(express.json()); // Pour analyser les données JSON (Parsing)
app.use(express.urlencoded({ extended: true })); // Pour analyser les données encodées en URL

// Préfixe de la route API :
app.use("/api", routes); // Utilise routes pour les routes générales sous /api
app.use("/api/auth", auth); // Utilise auth pour les routes d'authentification sous /api/auth

// Middleware pour la gestion des erreurs :
app.use((err, req, res, next) => {
  console.error(err.stack); // Affiche la stack de l'erreur dans la console
  console.error(`Error on route: ${req.originalUrl}`); // Affiche la route concernée
  res.status(500).send("Something broke!"); // Répond avec un message d'erreur générique
});

// Démarre un serveur web avec Express et écoute les requêtes HTTP sur un port spécifié :
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/api`);
});
