import { Link } from 'react-router-dom';

export default function VueloCard({ vuelo }) {
  if (!vuelo || !vuelo.id) return null; // Validación por seguridad

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 w-full max-w-md hover:scale-105 transition-transform duration-300 hover:shadow-xl">
      
      {/* Encabezado del vuelo */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-indigo-600">
          ✈️ Destino: {vuelo.destino}
        </h2>
        <span className="text-sm bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full font-medium">
          ID #{vuelo.id}
        </span>
      </div>

      {/* Detalles del vuelo */}
      <div className="text-gray-700 text-sm space-y-2">
        <p><strong>🛫 Salida:</strong> {vuelo.fechaInicio}</p>
        <p><strong>🛬 Llegada:</strong> {vuelo.fechaFin}</p>
        <p><strong>📝 Descripción:</strong> {vuelo.descripcion}</p>
        <p className="text-lg font-semibold text-green-700 mt-2">
          💰 ${vuelo.precio?.toLocaleString()}
        </p>
      </div>

      {/* Botón de acción */}
      <div className="mt-6 text-right">
        <Link
          to={`/vuelos/${vuelo.id}`}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition duration-200"
        >
          Ver Detalles
        </Link>
      </div>
    </div>
  );
}