import axios from 'axios';

const API_URL = 'http://localhost:8080/api/viajes';

export const obtenerVuelos = () => {
  return axios.get(API_URL);
};

export const buscarPorId = (id) => {
  return axios.get(`${API_URL}/${id}`);
};