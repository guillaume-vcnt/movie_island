import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const openaiKey = process.env.OPENAI_API_KEY;
if (!openaiKey) {
  console.error("La clé API OpenAI est manquante !");
}

const openai = new OpenAI({
  apiKey: `${openaiKey}`,
  organization: "org-tXYkHInc9vEwDd9dfquuMALN",
  project: "proj_V4Bp1oGfxOjpWWUrgZItAs2B",
});

const quizEvent = z.object({
  question: z.string(),
  answers: z.array(z.string()),
  correct_answer: z.string(),
});

export async function generateQuiz(movieTitle) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant designed to output JSON. The JSON should include 'question' (string), 'answers' (array of strings), and 'correct_answer' (string). Generate a 3-question quiz about the movie provided by the user.",
        },
        {
          role: "user",
          content: `Generate quiz about the movie ${movieTitle}`,
        },
      ],
      store: true,
      response_format: zodResponseFormat(quizEvent, "event"),
    });

    console.log("reponse openai", completion);
    const event = completion.choices[0].message;
    const jsonObject = JSON.parse(event.content);

    console.log(jsonObject);
    return jsonObject;
  } catch (error) {
    console.error("Erreur lors de la génération de la complétion :", error);
  }
}
