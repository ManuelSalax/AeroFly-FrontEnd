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

export async function obtenerReservaPorId(id) {
  return await axios.get(`http://localhost:8080/api/reservas/${id}`);
}

export async function obtenerReservas() {
  return await axios.get("http://localhost:8080/api/reservas");
}
