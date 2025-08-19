import { obtenerUsuarios } from './usuarioService';

export const autenticarUsuario = async (username, password) => {
  try {
    const response = await obtenerUsuarios();
    const usuarios = response.data;

    const usuarioEncontrado = usuarios.find(
      (u) => u.username === username && u.password === password
    );

    if (usuarioEncontrado) {
      localStorage.setItem('usuario', JSON.stringify(usuarioEncontrado));
      return usuarioEncontrado;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error al autenticar usuario", error);
    throw error;
  }
};

export const cerrarSesion = () => {
  localStorage.removeItem('usuario');
};

export const obtenerUsuarioActual = () => {
  return JSON.parse(localStorage.getItem('usuario'));
};