const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
app.use(express.json());

// -------------------------
// 1. Mock Stock API
// -------------------------
function getStock(symbol) {
  // mock fluctuating price
  const price = 100 + Math.random() * 50;
  return {
    symbol,
    price: Number(price.toFixed(2)),
    timestamp: Date.now()
  };
}

app.get("/api/stock/:symbol", (req, res) => {
  res.json(getStock(req.params.symbol));
});

// -------------------------
// 2. WebSocket Live Server
// -------------------------
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.send(JSON.stringify({
    message: "Connected to live stock feed",
    timestamp: Date.now()
  }));
});

// Broadcast stock updates every 1 second
setInterval(() => {
  const data = getStock("AAPL");
  const json = JSON.stringify(data);

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(json);
    }
  });

  console.log("Broadcast:", json);
}, 1000);

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
