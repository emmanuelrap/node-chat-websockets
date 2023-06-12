// Importamos las librerías requeridas
const WebSocket = require("ws");
const http      = require("http");


// Creamos una instacia del servidor HTTP
const server = http.createServer();

// Creamos el servidor websocket con base al servidor http
const wss    = new WebSocket.Server({ server });

// Escuchamos los diferentes eventos
wss.on("connection", function connection(ws) {
  
  // Escuchamos los mensajes entrantes
  ws.on("message", function incoming(data) {

    // Iteramos y envíamos a todos los clientes conectados la información recibida
    wss.clients.forEach(function each(client) {
      
      if (client.readyState === WebSocket.OPEN) {
        
        // Enviamos la información recibida
        client.send(data.toString());

      }
    });
  });
});

// Levantamos servidor HTTP
const port = process.env.PORT || 8080;
server.listen(port);
console.log("Servidor funcionando en: ",port)