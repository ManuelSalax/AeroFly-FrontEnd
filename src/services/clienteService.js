import axios from 'axios';

const API_URL = 'http://localhost:8080/api/clientes';

/**
 * 🧾 Obtener todos los clientes
 * GET /api/clientes
 */
export const obtenerClientes = async () => {
  return await axios.get(API_URL);
};

/**
 * 🔍 Buscar cliente por ID
 * GET /api/clientes/{id}
 */
export const buscarClientePorId = async (id) => {
  return await axios.get(`${API_URL}/${id}`);
};

/**
 * ➕ Registrar un nuevo cliente
 * POST /api/clientes
 * 
 * Ejemplo de body:
 * {
 *   "nombre": "Laura Torres",
 *   "email": "laura@correo.com",
 *   "telefono": "3012345678",
 *   "direccion": "Calle 123 #45-67"
 * }
 */
export const registrarCliente = async (cliente) => {
  return await axios.post(API_URL, cliente);
};

/**
 * ✏️ Actualizar un cliente existente
 * PUT /api/clientes/{id}
 */
export const actualizarCliente = async (id, cliente) => {
  return await axios.put(`${API_URL}/${id}`, cliente);
};

/**
 * ❌ Eliminar un cliente
 * DELETE /api/clientes/{id}
 */
export const eliminarCliente = async (id) => {
  return await axios.delete(`${API_URL}/${id}`);
};
