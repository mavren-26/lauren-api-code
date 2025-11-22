const requestLog = {};
const N = 3;      // max requests
const T = 10 * 1000; // time window in milliseconds

function canMakeRequest(userId) {
    const now = Date.now();

    if (!requestLog[userId]) requestLog[userId] = [];

    // Remove timestamps older than T seconds
    requestLog[userId] = requestLog[userId].filter(ts => now - ts <= T);

    if (requestLog[userId].length >= N) return false;

    requestLog[userId].push(now);
    return true;
}

// Example usage
console.log(canMakeRequest(1)); // true
console.log(canMakeRequest(1)); // true
console.log(canMakeRequest(1)); // true
console.log(canMakeRequest(1)); // false
