import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setError('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('http://localhost:8080/api/usuarios');
      const usuarios = response.data;

      const usuarioEncontrado = usuarios.find(
        (u) =>
          u.username === formData.username &&
          u.password === formData.password
      );

      if (usuarioEncontrado && usuarioEncontrado.id) {
        localStorage.setItem('usuario', JSON.stringify(usuarioEncontrado));
        navigate('/vuelos');
      } else {
        setError('Usuario o contraseña incorrectos');
      }
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setError('Error al conectar con el servidor');
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">Iniciar Sesión</h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Usuario</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition"
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
}