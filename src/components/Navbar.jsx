import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  // ✅ Cargar usuario (fusionado con cliente) desde localStorage
  useEffect(() => {
    const userData = localStorage.getItem('usuario');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUsuario(parsedUser);
      } catch (err) {
        console.error('Error al leer usuario desde localStorage', err);
      }
    }
  }, []);

  // ✅ Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('usuario');
    setUsuario(null);
    navigate('/'); // Redirige a inicio o info
  };

  return (
    <nav className="bg-blue-700 text-white px-6 py-4 shadow-md flex justify-between items-center">
      {/* 🔹 Sección izquierda */}
      <div className="flex items-center gap-4">
        <img
          src="/src/assets/avion_sin_fondo.png"
          alt="AeroFly"
          className="w-15 h-10"
        />
        <Link to="/info" className="text-xl font-bold hover:underline">
          AeroFly
        </Link>
        <Link to="/vuelos" className="hover:underline">
          Vuelos
        </Link>
        <Link to="/reservas" className="hover:underline">
          Reservas
        </Link>
        <Link to="/pagos" className="hover:underline">
          Pagos
        </Link>
      </div>

      {/* 🔹 Sección derecha (usuario o botones de login) */}
      <div className="flex items-center gap-4">
        {!usuario ? (
          <>
            <Link
              to="/registro"
              className="bg-white text-blue-700 font-semibold px-4 py-1 rounded hover:bg-blue-100"
            >
              Registrarse
            </Link>
            <Link
              to="/login"
              className="bg-white text-blue-700 font-semibold px-4 py-1 rounded hover:bg-blue-100"
            >
              Iniciar sesión
            </Link>
          </>
        ) : (
          <>
            {/* 👤 Usuario logueado con tooltip */}
            <div className="relative group">
              <span className="font-medium cursor-pointer">
                👤 {usuario.cliente?.nombre || usuario.username}
              </span>

              {/* Tooltip con correo */}
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max bg-gray-800 text-white text-sm px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {usuario.cliente?.email || usuario.email || 'Sin correo registrado'}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
