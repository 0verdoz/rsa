import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy GoogleGenAI initialization
let aiClient: GoogleGenAI | null = null;
function getAI() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// API Routes
app.post("/api/crypto-tutor", async (req, res) => {
  try {
    const { question, context } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const ai = getAI();
    const prompt = `You are "Professor Cyber", a warm, clear, and engaging RSA Cryptography & Mathematics Tutor for learners.
The user is viewing an interactive RSA story visualizer featuring Bello (Sender), Nii (Receiver), and Paulson (Eavesdropper).

Current visualizer state context:
${JSON.stringify(context || {}, null, 2)}

User Question: "${question}"

Provide a direct, friendly, and visually clear explanation (2-4 sentences max) explaining the mathematical concept, analogy (e.g. clock arithmetic, padlock, traps, prime building blocks), or why RSA remains secure. Use clean formatting and bolding for key terms.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.json({ text: response.text || "No response generated." });
  } catch (err: any) {
    console.error("AI Tutor Error:", err);
    res.status(500).json({ error: err.message || "AI Tutor is currently unavailable. Ensure GEMINI_API_KEY is configured." });
  }
});

// Vite middleware for dev or static serving for prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
