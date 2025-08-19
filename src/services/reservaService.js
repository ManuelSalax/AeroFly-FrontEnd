import axios from 'axios';

export async function registrarReserva(clienteId, viajeId) {
  return await axios.post(`http://localhost:8080/api/reservas?clienteId=${clienteId}&viajeId=${viajeId}`);
}