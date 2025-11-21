// File: api/mobile.js

export default async function handler(req, res) {
  // CORS allow for your frontend
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();

  // Simple AUTH (must match your Vercel environment variable)
  const correctPassword = process.env.API_PASSWORD || "";
  const auth = req.headers.authorization || "";

  if (!auth.startsWith("Bearer ") || auth.split(" ")[1] !== correctPassword) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Number to search
  const num = req.query.num || "";
  if (!num) {
    return res.status(400).json({ error: "num required" });
  }

  const upstreamURL = `https://meowmeow.rf.gd/gand/mobile.php?num=${encodeURIComponent(num)}`;

  try {
    const response = await fetch(upstreamURL);
    const text = await response.text();

    // Try to return JSON if possible
    try {
      const json = JSON.parse(text);
      return res.status(200).json(json);
    } catch {
      // If not JSON, return plain text
      res.setHeader("Content-Type", "text/plain");
      return res.status(200).send(text);
    }

  } catch (error) {
    console.error("Proxy Error:", error);
    return res.status(500).json({ error: "Proxy fetch failed" });
  }
}
