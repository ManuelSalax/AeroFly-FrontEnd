import { useState } from 'react';
import axios from 'axios';

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
      await axios.post('http://localhost:8080/api/usuarios', usuario);
      await axios.post('http://localhost:8080/api/clientes', cliente);
      alert('Registro exitoso');
    } catch (error) {
      console.error('Error al registrar:', error);
      alert('Ocurrió un error al registrar');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">Registro de Usuario</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        {/* Usuario */}
        <input type="text" name="username" placeholder="Nombre de usuario" onChange={handleChangeUsuario} className="input" required />
        <input type="password" name="password" placeholder="Contraseña" onChange={handleChangeUsuario} className="input" required />

        {/* Cliente */}
        <input type="text" name="nombre" placeholder="Nombre completo" onChange={handleChangeCliente} className="input" required />
        <input type="text" name="direccion" placeholder="Dirección" onChange={handleChangeCliente} className="input" required />
        <input type="email" name="email" placeholder="Correo electrónico" onChange={handleChangeCliente} className="input" required />
        <input type="tel" name="telefono" placeholder="Teléfono" onChange={handleChangeCliente} className="input" required />

        <button type="submit" className="bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 transition">
          Registrarse
        </button>
      </form>
    </div>
  );
}