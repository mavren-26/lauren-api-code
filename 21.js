const apiKeys = {
    "key1": ["/users", "/posts"],
    "key2": ["/posts"]
};

function canAccess(apiKey, endpoint) {
    const allowed = apiKeys[apiKey] || [];
    return allowed.includes(endpoint);
}

console.log(canAccess("key1", "/users")); 
console.log(canAccess("key2", "/users")); 
console.log(canAccess("key2", "/posts")); 
