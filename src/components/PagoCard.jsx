import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { registrarPago } from "../services/pagoService";

export default function PagoCard({ reservaId, monto, onPagoExitoso }) {
  const [metodoPago, setMetodoPago] = useState("Tarjeta");
  const [procesando, setProcesando] = useState(false);
  const [montoFinal, setMontoFinal] = useState(0);
  const [pagoRealizado, setPagoRealizado] = useState(false);

  useEffect(() => {
    if (monto && monto > 0) {
      setMontoFinal(monto);
    } else {
      console.warn("⚠️ Monto inválido o cero:", monto);
      setMontoFinal(0);
    }
  }, [monto]);

  const handlePago = async () => {
    console.log("💳 Procesando pago real:", { reservaId, montoFinal, metodoPago });

    if (!reservaId) {
      Swal.fire("Error", "Falta el ID de la reserva.", "error");
      return;
    }

    setProcesando(true);
    try {
      await registrarPago(reservaId, montoFinal, metodoPago);
      setPagoRealizado(true);
      Swal.fire("✅ Vuelo Pagado", "El pago fue procesado y registrado exitosamente.", "success");
      onPagoExitoso?.(); // si existe el callback, se ejecuta
    } catch (err) {
      console.error("Error al registrar el pago:", err);
      Swal.fire("❌ Error al Pagar", "No se pudo registrar el pago. Intenta de nuevo.", "error");
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 mt-8 text-center border animate-fadeIn">
      <h2 className="text-2xl font-bold text-green-700 mb-4">💳 Pago del Vuelo</h2>

      {pagoRealizado ? (
        <div className="text-green-700 text-xl font-semibold py-4">
          ✈️ Vuelo Pagado ✅
        </div>
      ) : (
        <>
          <p className="text-gray-700 mb-2">
            <strong>Monto a pagar:</strong>{" "}
            {montoFinal > 0 ? `$${montoFinal.toLocaleString()}` : "Monto no disponible"}
          </p>

          <div className="my-4">
            <label className="block text-gray-600 font-medium mb-2">
              Selecciona método de pago:
            </label>
            <select
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
              className="border rounded-lg px-4 py-2 w-full"
            >
              <option>Tarjeta</option>
              <option>Nequi</option>
              <option>Daviplata</option>
              <option>PSE</option>
            </select>
          </div>

          <button
            onClick={handlePago}
            disabled={procesando}
            className={`w-full py-2 rounded-lg text-white font-semibold ${
              procesando ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {procesando ? "Procesando..." : "Confirmar Pago"}
          </button>
        </>
      )}
    </div>
  );
}
