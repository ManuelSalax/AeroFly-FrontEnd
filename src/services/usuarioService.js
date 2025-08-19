import axios from 'axios';

const API_URL = 'http://localhost:8080/api/usuarios';

export const registrarUsuario = (usuario) => {
  return axios.post(API_URL, usuario);
};

export const obtenerUsuarios = () => {
  return axios.get(API_URL);
};