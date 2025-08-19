import axios from 'axios';

export async function registrarPago(pagoData) {
  return await axios.post('http://localhost:8080/api/pagos', pagoData);
}

export async function obtenerPagos() {
  return await axios.get('http://localhost:8080/api/pagos');
}