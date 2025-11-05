export default function DetallesReserva({ cliente, usuario, vuelo, onContinuarPago }) {
  // Log para depurar
  console.log("🧠 Datos en DetallesReserva:", { cliente, usuario, vuelo });

  // 🔹 Datos del cliente
  const nombreCliente =
    cliente?.nombre ||
    usuario?.cliente?.nombre ||
    usuario?.username ||
    'No disponible';

  const correoCliente =
    cliente?.email ||
    usuario?.cliente?.email ||
    usuario?.email ||
    usuario?.correo ||
    'Sin correo registrado';

  // 🔹 Datos del vuelo (con validaciones y formato)
  const origen = vuelo?.origen || 'No disponible';
  const destino = vuelo?.destino || 'No disponible';
  const fechaInicio = vuelo?.fechaInicio
    ? new Date(vuelo.fechaInicio).toLocaleDateString()
    : 'No especificada';
  const fechaFin = vuelo?.fechaFin
    ? new Date(vuelo.fechaFin).toLocaleDateString()
    : 'No especificada';
  const precio = vuelo?.precio
    ? `$${Number(vuelo.precio).toLocaleString()}`
    : 'Sin precio';
  const descripcion = vuelo?.descripcion || 'Sin descripción';

  // 🔹 Render
  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6 mt-8 animate-fadeIn">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4 text-center">
        🧾 Detalles de la Reserva
      </h2>

      {/* Información del cliente */}
      <div className="mb-6 border-b border-gray-200 pb-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">👤 Información del Cliente</h3>
        <p><strong>Nombre:</strong> {nombreCliente}</p>
        <p><strong>Email:</strong> {correoCliente}</p>
      </div>

      {/* Información del vuelo */}
      <div className="mb-6 border-b border-gray-200 pb-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">✈️ Detalles del Vuelo</h3>
        <p><strong>Origen:</strong> {origen}</p>
        <p><strong>Destino:</strong> {destino}</p>
        <p><strong>Fechas:</strong> {fechaInicio} → {fechaFin}</p>
        <p><strong>Precio:</strong> {precio}</p>
        <p><strong>Descripción:</strong> {descripcion}</p>
      </div>

      {/* Botón para continuar */}
      <div className="text-center mt-6">
        <button
          onClick={onContinuarPago}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300"
        >
          Continuar al Pago 💳
        </button>
      </div>
    </div>
  );
}
