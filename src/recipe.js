module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }
  try {
    const { ingredients } = req.body;
    const prompt = `I have these ingredients: ${ingredients.join(", ")}. Suggest one recipe I can make. Reply in markdown.`;

    const r = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );
    const data = await r.json();
    if (!r.ok) return res.status(500).json({ error: data });

    res.status(200).json({ recipe: data.candidates[0].content.parts[0].text });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
};