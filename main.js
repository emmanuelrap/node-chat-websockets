// Variables
const protocol = window.location.protocol === "https:" ? "wss" : "ws";
const host = window.location.host;
const url = `${protocol}://${host}/ws`; // Cambia "/ws" según tu configuración en el servidor

console.log("Corriendo en:", url);

const wss = new WebSocket(url);

const wrapperNot = document.querySelector("#notificaciones");
const usuario = document.querySelector("#usuario");
const mensaje = document.querySelector("#mensaje");
const mensajes = document.querySelector("#mensajes");

/**
 * Valida si el nombre de usuario es correcto
 * @param {event} evento
 */
function handleClickButonEnviar() {
  let selectedColor = localStorage.getItem("colorSeleccionado");
  if (mensaje.value == "") {
    wrapperNot.innerHTML =
      '<div class="alert alert-danger">Escribe un mensaje válido para enviar.</div>';
    return;
  }

  wrapperNot.innerHTML = "";

  const fechaActual = new Date();
  let payload = {
    usuario: usuario.value,
    mensaje: mensaje.value,
    fecha: fechaActual,
    hora: fechaActual.getHours(),
    minutos: fechaActual.getMinutes(),
    color: selectedColor,
  };

  // Envía mensaje al WebSocket
  wss.send(JSON.stringify(payload));

  // Reiniciar nuestro input
  mensaje.value = "";
}

function validarUsuario(evento) {
  if (usuario.value == "") {
    usuario.classList.remove("is-valid");
    usuario.classList.add("is-invalid");
    wrapperNot.innerHTML =
      '<div class="alert alert-danger">Escribe tu nombre de usuario para chatear.</div>';

    // Bloquear el input
    mensaje.setAttribute("disabled", true);
  } else {
    // Mostrar el nombre como válido
    usuario.classList.remove("is-invalid");
    usuario.classList.add("is-valid");

    // Activar el input
    mensaje.removeAttribute("disabled");

    // Limpia notificaciones en caso de existir
    wrapperNot.innerHTML = "";
  }
}

// Evento para validar el nombre del usuario
usuario.addEventListener("keyup", validarUsuario);

/**
 * Se ejecuta cuando se abre una conexión con éxito de websocket
 */
function open() {
  // Abre conexión
  const mensajesGuardados = JSON.parse(
    localStorage.getItem("mensajesGuardados")
  );
  console.log("mensajesGuardados", mensajesGuardados);
  console.log("WebSocket abierto.");

  if (mensajesGuardados !== null) {
    mensajesGuardados.map((mensaje) => {
      console.log("Mapeo de mensajes");

      // Crea un nuevo elemento de mensaje
      const nuevoMensaje = crearMensajeElemento(mensaje);
      // Agrega el nuevo elemento al contenedor de mensajes
      mensajes.appendChild(nuevoMensaje);
    });
  }
}

/**
 * Crea un elemento de mensaje con los datos proporcionados
 * @param {Object} data - Datos del mensaje
 * @returns {HTMLElement} - Elemento HTML del mensaje
 */
function crearMensajeElemento(data) {
  const fechaActual = new Date();
  const horaActual = fechaActual.getHours();
  const minutosActuales = fechaActual.getMinutes();

  const mensajeElemento = document.createElement("div");
  mensajeElemento.className = "row";
  mensajeElemento.innerHTML = /* html */ `
    <div class="col-12 col-md-8 shadow rounded d-block px-3 py-2 mb-2 text-black" style="background-color: ${data.color};">
      <span class="fw-bold d-block">${data.usuario} :</span>
      ${data.mensaje} 
      <small class="d-block text-muted">${data.hora}:${data.minutos}</small>
    </div>
  `;

  return mensajeElemento;
}

// SE EJECUTA AL RECIBIR UN NUEVO MENSAJE
function message(evento) {
  console.log("WebSocket ha recibido un mensaje");

  // payload del mensaje
  let data = JSON.parse(evento.data);

  // mostrar mensaje en HTML
  const fechaActual = new Date();
  const horaActual = fechaActual.getHours();
  const minutosActuales = fechaActual.getMinutes();
  let selectedColor = localStorage.getItem("colorSeleccionado");

  if (data.usuario == usuario.value) {
    // Crea un nuevo elemento de mensaje
    const nuevoMensaje = crearMensajeElemento(data);
    nuevoMensaje.classList.add("text-right"); // Añade la clase para alinear a la derecha
    // Agrega el nuevo elemento al contenedor de mensajes
    mensajes.appendChild(nuevoMensaje);
  } else {
    // Crea un nuevo elemento de mensaje
    const nuevoMensaje = crearMensajeElemento(data);
    // Agrega el nuevo elemento al contenedor de mensajes
    mensajes.appendChild(nuevoMensaje);
  }

  // Guardar el mensaje en Local Storage
  let mensajesGuardados = JSON.parse(localStorage.getItem("mensajesGuardados"));
  if (mensajesGuardados !== null) {
    mensajesGuardados.push(data);
    console.log("MensajesGuardados (Enviaste)", mensajesGuardados);
    localStorage.setItem(
      "mensajesGuardados",
      JSON.stringify(mensajesGuardados)
    );
  } else {
    mensajesGuardados = [data];
    console.log("MensajesGuardados (Enviaste)", mensajesGuardados);
    localStorage.setItem(
      "mensajesGuardados",
      JSON.stringify(mensajesGuardados)
    );
  }
}

/**
 * Se ejecuta cuando ocurre algún error en la conexión
 * @param {event} evento
 */
function error(evento) {
  console.error("WebSocket ha observado un error: ", evento);
}

wss.addEventListener("error", function (evento) {
  console.error("WebSocket ha observado un error: ", evento);
});

// Se ejecuta al cerrarse una conexión
function close() {
  console.log("WebSocket cerrado.");
}

/**
 * Procesa el envío del mensaje por websocket
 * @param {event} evento
 * @returns {void}
 */
function enviarMensaje(evento) {
  let selectedColor = localStorage.getItem("colorSeleccionado");
  // Evento tecla Enter
  if (evento.code === "Enter") {
    if (mensaje.value == "") {
      wrapperNot.innerHTML =
        '<div class="alert alert-danger">Escribe un mensaje válido para enviar.</div>';
      return;
    }

    wrapperNot.innerHTML = "";
    const fechaActual = new Date();
    let payload = {
      usuario: usuario.value,
      mensaje: mensaje.value,
      fecha: fechaActual,
      hora: fechaActual.getHours(),
      minutos: fechaActual.getMinutes(),
      color: selectedColor,
    };

    // Envía mensaje al WebSocket y LocalStorage
    wss.send(JSON.stringify(payload));
    let mensajesGuardados = JSON.parse(
      localStorage.getItem("mensajesGuardados")
    );
    mensajesGuardados.push(payload);
    console.log("MensajesGuardados (Te enviaron)", mensajesGuardados);
    localStorage.setItem(
      "mensajesGuardados",
      JSON.stringify(mensajesGuardados)
    );

    // Reiniciar nuestro input
    mensaje.value = "";
  }
}

// Evento para enviar nuevo mensaje
mensaje.addEventListener("keypress", enviarMensaje);

// Eventos de WebSocket
wss.addEventListener("open", open);
wss.addEventListener("message", message);
wss.addEventListener("error", error);
wss.addEventListener("close", close);
