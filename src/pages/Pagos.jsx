export default function Pagos() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-10">
      <h2 className="text-3xl font-bold text-green-700 mb-6">Registrar Pago</h2>
      <form className="bg-white shadow-md rounded-lg p-6 w-full max-w-md space-y-4">
        <input
          type="text"
          placeholder="ID de Reserva"
          className="w-full border border-gray-300 rounded px-4 py-2"
        />
        <input
          type="number"
          placeholder="Monto"
          className="w-full border border-gray-300 rounded px-4 py-2"
        />
        <input
          type="text"
          placeholder="Método de Pago"
          className="w-full border border-gray-300 rounded px-4 py-2"
        />
        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Confirmar Pago
        </button>
      </form>
    </div>
  );
}