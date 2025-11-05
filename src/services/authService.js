import { obtenerUsuarios } from './usuarioService';
import { obtenerClientes } from './clienteService'; // 👈 asegúrate de tener este servicio

export const autenticarUsuario = async (username, password) => {
  try {
    const response = await obtenerUsuarios();
    const usuarios = response.data;

    // Buscar usuario por username y password
    const usuarioEncontrado = usuarios.find(
      (u) => u.username === username && u.password === password
    );

    if (!usuarioEncontrado) return null;

    // 🔹 Buscar cliente asociado (suponiendo que el usuario tiene un campo clienteId)
    let cliente = null;
    try {
      const clientesResponse = await obtenerClientes();
      const clientes = clientesResponse.data;

      cliente = clientes.find((c) => c.usuarioId === usuarioEncontrado.id);
    } catch (err) {
      console.warn('No se pudo obtener cliente asociado:', err);
    }

    // 🔹 Fusionar usuario y cliente
    const usuarioCompleto = {
      ...usuarioEncontrado,
      email:
        cliente?.email ||
        usuarioEncontrado.email ||
        `${usuarioEncontrado.username}@aerofly.com`,
      cliente: cliente || null,
    };

    // Guardar en localStorage
    localStorage.setItem('usuario', JSON.stringify(usuarioCompleto));

    return usuarioCompleto;
  } catch (error) {
    console.error('Error al autenticar usuario', error);
    throw error;
  }
};

export const cerrarSesion = () => {
  localStorage.removeItem('usuario');
};

export const obtenerUsuarioActual = () => {
  const data = localStorage.getItem('usuario');
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};
