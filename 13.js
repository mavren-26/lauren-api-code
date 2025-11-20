// API Log Analyzer: Most active user, error rate per user, global error %

function analyzeLogs(logs) {
    const userStats = {};
    let totalCalls = 0;
    let totalErrors = 0;

    for (const line of logs) {
        const [timestamp, user, statusStr] = line.split(" ");
        const status = parseInt(statusStr);

        if (!userStats[user]) {
            userStats[user] = { calls: 0, errors: 0 };
        }

        userStats[user].calls++;
        totalCalls++;

        if (status >= 400) {
            userStats[user].errors++;
            totalErrors++;
        }
    }

    // Most active user
    let mostActiveUser = null;
    let maxCalls = 0;
    for (const user in userStats) {
        if (userStats[user].calls > maxCalls) {
            maxCalls = userStats[user].calls;
            mostActiveUser = user;
        }
    }

    const globalErrorPercentage = ((totalErrors / totalCalls) * 100).toFixed(2);

    return {
        mostActiveUser,
        userStats,
        globalErrorPercentage
    };
}

// DRIVER CODE
const logs = [
    "100 user1 200",
    "101 user2 500",
    "102 user1 500",
    "103 user1 200",
    "105 user3 404"
];

console.log(analyzeLogs(logs));
