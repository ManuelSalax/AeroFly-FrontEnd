import { useEffect, useState } from 'react';
import { obtenerVuelos } from '../services/vueloService';
import VueloCard from '../components/VueloCard';

export default function Vuelos() {
  const [vuelos, setVuelos] = useState([]);

  useEffect(() => {
    obtenerVuelos()
      .then((res) => setVuelos(res.data))
      .catch((err) => console.error('Error al cargar vuelos:', err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold text-indigo-700 mb-8">Vuelos Disponibles</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {vuelos.length > 0 ? (
          vuelos.map((vuelo) => (
            <VueloCard key={vuelo.id} vuelo={vuelo} />
          ))
        ) : (
          <p className="text-gray-600">No hay vuelos disponibles.</p>
        )}
      </div>
    </div>
  );
}