const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
app.use(express.json());

let messages = [];

// -------------------------
// 1. REST API -> Send Message
// -------------------------
app.post("/api/sendMessage", (req, res) => {
  const { user, message } = req.body;

  const msg = {
    type: "message",
    user,
    message,
    time: Date.now()
  };

  messages.push(msg);

  // Broadcast to all websocket clients
  broadcast(msg);

  res.json({ status: "Message sent", msg });
});

// -------------------------
// 2. WebSocket Chat Server
// -------------------------
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Broadcast helper
function broadcast(obj, except = null) {
  const json = JSON.stringify(obj);

  wss.clients.forEach((client) => {
    if (client !== except && client.readyState === WebSocket.OPEN) {
      client.send(json);
    }
  });
}

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", (msg) => {
    const data = JSON.parse(msg);

    // Typing event
    if (data.type === "typing") {
      broadcast({ type: "typing", user: data.user }, ws);
    }
  });
});

server.listen(4000, () => {
  console.log("Chat server running on http://localhost:4000");
});
