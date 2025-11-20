// Token Bucket Rate Limiter Middleware

const buckets = new Map();

function rateLimiter(req, res, next) {
    const ip = req.ip;
    const capacity = 5;
    const refillRate = 1; // 1 token per 2 seconds
    const refillInterval = 2000;

    let bucket = buckets.get(ip);

    const now = Date.now();

    if (!bucket) {
        bucket = { tokens: capacity, lastRefill: now };
        buckets.set(ip, bucket);
    }

    // Refill tokens
    const timeDiff = now - bucket.lastRefill;
    const refillTokens = Math.floor(timeDiff / refillInterval);

    if (refillTokens > 0) {
        bucket.tokens = Math.min(capacity, bucket.tokens + refillTokens);
        bucket.lastRefill = now;
    }

    // Check if allowed
    if (bucket.tokens > 0) {
        bucket.tokens--;
        return next();
    }

    return res.status(429).json({ message: "Too many requests. Slow down!" });
}

// Express app
import express from "express";
const app = express();

app.use(rateLimiter);

app.get("/", (req, res) => {
    res.send("Welcome! Request accepted.");
});

app.listen(3000, () => console.log("Server running on 3000"));
