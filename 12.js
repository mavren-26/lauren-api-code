// Rate Limiter using Sliding Window

class RateLimiter {
    constructor(limit, windowSec) {
        this.limit = limit;
        this.window = windowSec * 1000; // convert to ms
        this.userRequests = new Map();  // userId -> array of timestamps
    }

    allowRequest(userId) {
        const now = Date.now();

        if (!this.userRequests.has(userId)) {
            this.userRequests.set(userId, []);
        }

        const timestamps = this.userRequests.get(userId);

        // Remove timestamps older than window
        while (timestamps.length && (now - timestamps[0] > this.window)) {
            timestamps.shift();
        }

        if (timestamps.length < this.limit) {
            timestamps.push(now);
            return true;
        }

        return false;
    }
}

// DRIVER CODE
const limiter = new RateLimiter(3, 10); // 3 requests in 10 seconds

console.log(limiter.allowRequest("user1")); // true
console.log(limiter.allowRequest("user1")); // true
console.log(limiter.allowRequest("user1")); // true
console.log(limiter.allowRequest("user1")); // false (rate limited)

setTimeout(() => {
    console.log(limiter.allowRequest("user1")); // true after window reset
}, 11000);
