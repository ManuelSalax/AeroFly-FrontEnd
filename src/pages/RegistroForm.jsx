import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function RegistroForm() {
  const [usuario, setUsuario] = useState({
    username: '',
    password: '',
    rol: 'CLIENTE',
  });

  const [cliente, setCliente] = useState({
    nombre: '',
    direccion: '',
    email: '',
    telefono: '',
  });

  const handleChangeUsuario = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  const handleChangeCliente = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ Crear primero el usuario
      const usuarioResponse = await axios.post('http://localhost:8080/api/usuarios', usuario);
      const usuarioId = usuarioResponse.data.id;

      // 2️⃣ Crear el cliente asociado al usuario
      const clienteConUsuario = { ...cliente, usuarioId }; // 👈 enviamos el id del usuario creado
      await axios.post('http://localhost:8080/api/clientes', clienteConUsuario);

      // ✅ Mensaje de éxito con SweetAlert
      Swal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        text: 'Tu cuenta ha sido creada correctamente.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#3085d6',
      });

      // Limpieza de formularios
      setUsuario({ username: '', password: '', rol: 'CLIENTE' });
      setCliente({ nombre: '', direccion: '', email: '', telefono: '' });
    } catch (error) {
      console.error('❌ Error al registrar:', error);

      // ❌ Mensaje de error con SweetAlert
      Swal.fire({
        icon: 'error',
        title: 'Error al registrar',
        text:
          error.response?.data?.message ||
          'Ocurrió un problema durante el registro. Intenta nuevamente.',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#d33',
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-md animate-fadeIn">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">Registro de Usuario</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        {/* Datos de usuario */}
        <input
          type="text"
          name="username"
          placeholder="Nombre de usuario"
          value={usuario.username}
          onChange={handleChangeUsuario}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={usuario.password}
          onChange={handleChangeUsuario}
          className="border p-2 rounded"
          required
        />

        {/* Datos del cliente */}
        <input
          type="text"
          name="nombre"
          placeholder="Nombre completo"
          value={cliente.nombre}
          onChange={handleChangeCliente}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="direccion"
          placeholder="Dirección"
          value={cliente.direccion}
          onChange={handleChangeCliente}
          className="border p-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={cliente.email}
          onChange={handleChangeCliente}
          className="border p-2 rounded"
          required
        />
        <input
          type="tel"
          name="telefono"
          placeholder="Teléfono"
          value={cliente.telefono}
          onChange={handleChangeCliente}
          className="border p-2 rounded"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}
