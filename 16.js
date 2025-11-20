import express from "express";
import crypto from "crypto";

const app = express();
app.use(express.json());

// In-memory store
const urlDB = {};

function generateCode() {
    return crypto.randomBytes(3).toString("hex"); // 6-char code
}

// Create short URL
app.post("/shorten", (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL required" });

    const code = generateCode();
    urlDB[code] = url;

    res.json({ shortUrl: `http://localhost:3000/${code}` });
});

// Redirect
app.get("/:code", (req, res) => {
    const code = req.params.code;
    const longUrl = urlDB[code];

    if (!longUrl)
        return res.status(404).json({ error: "Short URL not found" });

    res.redirect(longUrl);
});

app.listen(3000, () => console.log("URL Shortener running on 3000"));
