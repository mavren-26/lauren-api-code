const express = require("express");
const app = express();
app.use(express.json());

const PORT = 4000;

// Store logs in memory
const logs = [];

app.post("/log", (req, res) => {
    const { userId, action } = req.body;

    if (!userId || !action) {
        return res.status(400).json({ error: "userId and action required" });
    }

    logs.push({
        userId,
        action,
        timestamp: Date.now()
    });

    res.json({ message: "logged" });
});

app.get("/active-users", (req, res) => {
    const minutes = Number(req.query.minutes) || 5;
    const now = Date.now();
    const windowSize = minutes * 60 * 1000;

    const active = new Set();

    logs.forEach(log => {
        if (now - log.timestamp <= windowSize) {
            active.add(log.userId);
        }
    });

    res.json({
        activeUsers: active.size
    });
});

app.listen(PORT, () => console.log("Analytics server running on port " + PORT));
