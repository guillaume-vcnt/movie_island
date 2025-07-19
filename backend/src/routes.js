import express from "express";
import { neon } from "@neondatabase/serverless";
import { generateQuiz } from "./openai.js";
import dotenv from "dotenv";

dotenv.config();

const sql = neon(process.env.DATABASE_URL);
const router = express.Router();

// Route principale :
router.get("/", async (req, res) => {
  try {
    console.log("Route principale");
    const result = await sql`SELECT version()`;
    const { version } = result[0];
    res.send(`Database version: ${version}`);
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).send("Server Error");
  }
});

// Route pour récupérer tous les films ou les film par genre :
// Note : PostgreSQL protège les requêtes préparées : En utilisant ${genre}, la valeur est envoyée séparément de la requête SQL, ce qui empêche une injection SQL. L'opérateur ANY() ne permet pas d'exécuter du code arbitraire : Contrairement à ILIKE ou LIKE où un % malicieux peut être injecté, ici la comparaison ANY(string_to_array(...)) ne laisse pas d'ouverture.
router.get("/movie", async (req, res) => {
  console.log(req.query);
  const { genre, searching } = req.query;
  console.log(genre);
  try {
    if (searching) {
      console.log("Route search");
      const result =
        await sql`SELECT * FROM "Movies" WHERE "title" ILIKE '%' || ${searching} || '%' OR "director" ILIKE '%' || ${searching} || '%' OR "genre" ILIKE '%' || ${searching} || '%' OR "year"::text ILIKE '%' || ${searching} || '%'`;
      const data = result;
      res.json({ message: "Methode GET : film par recherche", data });
    } else if (genre) {
      console.log("Route genre");
      const result =
        await sql`SELECT * FROM "Movies" WHERE "genre" LIKE '%' || ${genre} || '%';`;
      const data = result;
      res.json({ message: "Methode GET : film par genre", data });
    } else {
      console.log("Route tous les films");
      const result = await sql`SELECT * FROM "Movies"`;
      const data = result;
      res.json({ message: "Methode GET : tous les films", data });
    }
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).send("Server Error");
  }
});

// Route pour récupérer les films par id :
router.get("/movie/:id", async (req, res) => {
  try {
    console.log("Route films par id");
    const id = req.params.id;
    const result = await sql`SELECT * FROM "Movies" WHERE "id" = ${id};`;
    const data = result;
    res.json({ message: "Methode GET : films par id", data });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).send("Server Error");
  }
});

// Route Quiz OpenAI :
router.get("/movie/:id/quiz", async (req, res) => {
  try {
    console.log("Route génération de quiz");
    const id = req.params.id;
    const movie = await sql`SELECT * FROM "Movies" WHERE "id" = ${id};`;
    console.log("Movie", movie);
    const movieTitle = movie[0].title;
    const quiz = await generateQuiz(movieTitle);
    console.log("title", movieTitle);
    console.log("Quiz", quiz);
    res.json({ message: "Methode GET : génération de quiz", quiz });
  } catch (error) {
    console.error("OPENAI API Error:", error);
    res.status(500).send("Server Error");
  }
});

// Route pour ajouter un film :
router.post("/movie", async (req, res) => {
  try {
    console.log("Route ajouter un film");
    const data = req.body;
    await sql`INSERT INTO "Movies" ("title", "director", "year", "genre", "duration", "audience")
                VALUES (${data.title}, ${data.director}, ${data.year}, ${data.genre}, ${data.duration}, ${data.audience});`;
    res.json({ message: "Methode POST : ajouter un film" });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).send("Server Error");
  }
});

// Route pour mettre à jour un film :
router.put("/movie/:id", async (req, res) => {
  try {
    console.log("Route mettre à jour un film");
    const data = req.params.id;
    const newdata = req.body.newtitle;
    await sql`UPDATE "Movies" SET "title" = ${newdata.newtitle} WHERE "id" = ${data}`;
    res.json({ message: "Methode PUT : mettre à jour un film" });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).send("Server Error");
  }
});

// Route pour supprimer un film :
router.delete("/movie/:id", async (req, res) => {
  try {
    console.log("Route supprimer un film");
    const data = req.params.id;
    await sql`DELETE FROM "Movies" WHERE "id" = ${data};`;
    res.json({ message: "Methode DELETE, supprimer un film" });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).send("Server Error");
  }
});

export default router;
