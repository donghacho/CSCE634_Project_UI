// server.js (ESM version)
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch"; // Needed for Node.js

const app = express();
const PORT = 3000;

// Your REAL Gemini API key
const GEMINI_API_KEY = "AIzaSyDOXk7e29yYie0ltFvGmlnf6_LsG5JABrY";

app.use(cors());
app.use(bodyParser.json());

// API ENDPOINT
app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;
  console.log("Received from frontend:", userMessage);

  try {
    // Use correct Gemini 2.5 Flash model + correct API format
    const apiURL =
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(apiURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: userMessage }]
          }
        ]
      })
    });

    const data = await response.json();
    console.log("Gemini Response JSON:", data);

    // Extract text safely
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "[No reply received from Gemini]";

    res.json({ reply });

  } catch (err) {
    console.error("Backend Error:", err);
    res.status(500).json({ reply: "[Backend error while reaching Gemini API]" });
  }
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
