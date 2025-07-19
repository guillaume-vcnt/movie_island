import express from "express";
import { neon } from "@neondatabase/serverless";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

// Initialisation de la connexion à la base de données avec Neon :
const sql = neon(process.env.DATABASE_URL);
const router = express.Router();

// Route d'inscription :
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Requête SQL pour vérifier si l'email est déjà dans la base de données.
    // Si un utilisateur avec cet email existe et si c'est le cas (tableau non vide), on renvoie une erreur pour éviter les doublons.
    const existingEmail = await sql`
      SELECT * FROM "Users" WHERE "email" = ${email}`;
    if (existingEmail.length > 0) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }
    // Hacher le mot de passe pour le rendre sécurisé avant de l'enregistrer dans la base de données.
    // Le chiffre "10" représente le nombre de tours de hachage.
    const hashedPassword = await bcrypt.hash(password, 10);
    // Insertion du nouvel utilisateur dans la base de données avec l'email et le mot de passe haché.
    // Utilisation de RETURNING * pour renvoyer l'utilisateur nouvellement créé. Cela permet de tout faire en une seule transaction (une insertion et une récupération), ce qui peut améliorer la performance et réduire les risques d'incohérence entre deux requêtes séparées.
    const result = await sql`
      INSERT INTO "Users" ("email", "password")
      VALUES (${email}, ${hashedPassword})
      RETURNING *`;
    // Envoi de la réponse avec le message de succès et l'utilisateur créé. Result[0] permet d'accéder au premier élément du tableau result, qui contient les informations de l'utilisateur nouvellement créé. Même si tu insères un seul utilisateur, le résultat sera toujours un tableau, donc tu accèdes à cet utilisateur avec [0].
    // En cas d'erreur, on affiche l'erreur et on renvoie une réponse d'erreur.
    res.json({ message: "Utilisateur créé !", user: result[0] });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la création de l'utilisateur" });
  }
});

// Route de connexion :
// Vérifie les identifiants et génère un JWT (JSON Web Token), utilisé pour échanger des informations entre deux parties, généralement entre un client (par exemple, une application web) et un serveur. Ce token permet d'authentifier et d'autoriser des utilisateurs tout en garantissant l'intégrité des données transmises.
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Code SQL pour récupérer l'utilisateur par email.
    // On prend le premier (et normalement le seul) utilisateur trouvé.
    // Vérifier si l'utilisateur existe et si le mot de passe est correct.
    // Si l'utilisateur n'existe pas ou que le mot de passe est incorrect.
    const result = await sql`
      SELECT * FROM "Users" WHERE "email" = ${email}`;
    const user = result[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }
    // Générer un token JWT, le token est signé avec un secret et contient l'email de l'utilisateur.
    // OpenSSL est un outil de ligne de commande très utilisé pour générer des clés et des certificats, et il peut aussi être utilisé pour générer des secrets puissants pour des tokens JWT. Commande : openssl rand -base64 32.
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      algorithm: "HS256", // Utilisation de l'algorithme HMAC-SHA256
      expiresIn: "1h", // Le token expire après 1 heure
    });
    // Renvoi du token dans la réponse.
    // En cas d'erreur, on affiche l'erreur et on renvoie une réponse d'erreur.
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la connexion" });
  }
});

// Middleware pour protéger les routes (vérifie le JWT) :
const verifyToken = (req, res, next) => {
  // Récupérer le token du header Authorization.
  // Le token est souvent passé dans le header sous la forme "Bearer token".
  // Si aucun token n'est fourni, on renvoie une erreur.
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ message: "Accès refusé" });
  // Vérifier la validité du token avec la clé secrète (le même secret utilisé pour la création du token).
  // Stocker les informations de l'utilisateur décodées dans la requête (pour qu'elles soient accessibles dans les prochaines étapes).
  // Passer à la suite du traitement. Si le token est invalide ou a expiré, renvoyer une erreur.
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalide" });
  }
};

// Route protégée :
// Accessible uniquement avec un JWT valide. Si le token est valide, renvoie les informations de l'utilisateur.
router.get("/user", verifyToken, (req, res) => {
  res.json({ message: "Accès autorisé", user: req.user });
});

export default router;
