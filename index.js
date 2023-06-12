const WebSocket = require("ws");

// Función para manejar las conexiones WebSocket
function handleWebSocketConnection() {
  const wss = new WebSocket.Server({ noServer: true });

  wss.on("connection", function connection(ws) {
    ws.on("message", function incoming(data) {
      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data.toString());
        }
      });
    });
  });

  return wss;
}

module.exports = (req, res) => {
  if (req.headers.upgrade && req.headers.upgrade.toLowerCase() === "websocket") {
    const wss = handleWebSocketConnection();
    wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onConnect);
  } else {
    // Aquí manejas la solicitud HTTP normal si es necesario
    res.statusCode = 404;
    res.end();
  }
};

function onConnect(ws) {
  const wss = handleWebSocketConnection();
  wss.emit("connection", ws);
}
