// server.js (ESM version)
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch"; // Needed for Node.js
import { configDotenv } from "dotenv";
import {marked} from 'marked'

const app = express();
const PORT = 3000;

// Your Gemini API key
configDotenv()
const GEMINI_API_KEY = process.env.API_KEY;

if (!GEMINI_API_KEY) {
    console.error("API_KEY is not defined in environment variables!");
    process.exit(1); 
}

app.use(cors());
app.use(bodyParser.json());

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;
  console.log("Received from frontend:", userMessage.substring(0, 100) + "..."); // Log a snippet

  try {
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

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "[No reply received from Gemini]";

    const htmlReply =  marked.parse(reply);
    res.json({ reply: htmlReply });
  } catch (err) {
    console.error("Backend Error in /api/chat:", err);
    res.status(500).json({ reply: "[Backend error while reaching Gemini API]" });
  }
});

app.post("/api/inittrain", async (req, res) => {
    try {
        let pdfText = req.body.message;

        let prompt =
          `Summarize the following document so I can use the summary as context later:\n\n"""${pdfText}"""`;

        let response = await fetch("http://localhost:3000/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: prompt })
        });
        const responseData = await response.json();
        res.status(response.status).json(responseData);
    } catch (error) {
        console.error("Error in /api/inittrain:", error);
        res.status(500).json({ reply: "Failed to process PDF or communicate with chat API." });
    }
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
