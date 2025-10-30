import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

app.get("/", (req, res) => {
  res.send("✅ Bot is running on Render and ready for Telegram messages!");
});

app.post("/webhook", async (req, res) => {
  const message = req.body.message?.text;
  const chatId = req.body.message?.chat?.id;

  if (!message || !chatId) return res.sendStatus(200);

  try {
    // 🔹 Send message to Gemini
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }]
        })
      }
    );

    const data = await geminiResponse.json();

    // 🔍 Log Gemini’s raw response for debugging
    console.log("Gemini response:", JSON.stringify(data, null, 2));

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "🤖 Sorry, Gemini didn’t return a valid response.";

    // 🔹 Send reply back to Telegram
    await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: reply })
    });
  } catch (error) {
    console.error("🔥 Gemini request failed:", error);
    await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: "❌ Error connecting to Gemini API. Check logs."
      })
    });
  }

  res.sendStatus(200);
});

app.listen(3000, () => console.log("✅ Bot running on port 3000"));

