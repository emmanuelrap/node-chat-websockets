const WebSocket = require("ws");

// Función para manejar las conexiones WebSocket
function handleWebSocketConnection(wss) {
  wss.on("connection", function connection(ws) {
    ws.on("message", function incoming(data) {
      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data.toString());
        }
      });
    });
  });
}

module.exports = function (req, res) {
  if (
    req.headers.upgrade &&
    req.headers.upgrade.toLowerCase() === "websocket"
  ) {
    const wss = new WebSocket.Server({ noServer: true });
    handleWebSocketConnection(wss);
    wss.handleUpgrade(req, req.socket, Buffer.alloc(0), function onConnect(ws) {
      wss.emit("connection", ws);
    });
  } else {
    res.statusCode = 404;
    res.end();
  }
};
console.log("Servidor funcionando...");
