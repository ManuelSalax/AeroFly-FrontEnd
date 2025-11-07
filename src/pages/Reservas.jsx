export default function Reservas() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-10">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">Reservar Vuelo</h2>
      <form className="bg-white shadow-md rounded-lg p-6 w-full max-w-md space-y-4">
        <input
          type="text"
          placeholder="ID del Cliente"
          className="w-full border border-gray-300 rounded px-4 py-2"
        />
        <input
          type="text"
          placeholder="ID del Vuelo"
          className="w-full border border-gray-300 rounded px-4 py-2"
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Confirmar Reservas
        </button>

      </form>
    </div>
  );
}