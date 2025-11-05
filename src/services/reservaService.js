// src/services/reservaService.js
import axios from "axios";

export async function registrarReserva(clienteId, vueloId) {
  return await axios.post("http://localhost:8080/api/reservas", {
    clienteId,
    vueloId,
  }, {
    headers: { "Content-Type": "application/json" },
  });
}
