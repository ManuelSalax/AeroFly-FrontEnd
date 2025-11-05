import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { registrarReserva } from "../services/reservaService";
import PagoCard from "./PagoCard";

export default function ReservaForm({ vueloId, vueloPrecio }) {
  const [clienteId, setClienteId] = useState(null);
  const [reservaId, setReservaId] = useState(null);
  const [monto, setMonto] = useState(0);
  const [enviando, setEnviando] = useState(false);
  const [mostrarPago, setMostrarPago] = useState(false);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      const usuario = JSON.parse(usuarioGuardado);
      setClienteId(usuario.cliente?.id || usuario.id);
    } else {
      Swal.fire("Error", "No se encontró el usuario en sesión", "error");
    }
  }, []);

  const handleReserva = async (e) => {
    e.preventDefault();

    if (!clienteId || !vueloId) {
      Swal.fire("Error", "Cliente o vuelo no válido.", "error");
      return;
    }

    try {
      setEnviando(true);

      // 🟢 Registrar reserva
      const res = await registrarReserva(clienteId, vueloId);
      const reserva = res.data;

      console.log("🧾 Respuesta del backend (reserva):", reserva);

      setReservaId(reserva.id);

      // 🟢 Intentar obtener precio desde backend o prop
      const precioVuelo =
        reserva?.vuelo?.precio ??
        reserva?.vuelo?.valor ??
        vueloPrecio ??
        0;

      console.log("💰 Precio detectado para pago:", precioVuelo);
      setMonto(precioVuelo);

      Swal.fire("✅ Reserva exitosa", "Tu reserva ha sido registrada.", "success");
      setMostrarPago(true);
    } catch (error) {
      console.error("Error al registrar la reserva:", error);
      Swal.fire("❌ Error", "No se pudo realizar la reserva.", "error");
    } finally {
      setEnviando(false);
    }
  };

  // 💳 Mostrar pago cuando haya reserva y monto
  if (mostrarPago && reservaId) {
    console.log("📦 Mostrando PagoCard con:", { reservaId, monto });
    return (
      <PagoCard
        reservaId={reservaId}
        monto={monto > 0 ? monto : vueloPrecio || 0}
        onPagoExitoso={() => {
          Swal.fire("🎉 Pago completado", "¡Tu vuelo ha sido confirmado!", "success");
          setMostrarPago(false);
        }}
      />
    );
  }

  // 🧾 Formulario de reserva
  return (
    <div className="max-w-3xl mx-auto bg-white shadow rounded-xl p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-4">✍️ Reservar Vuelo</h2>
      <form onSubmit={handleReserva} className="space-y-4">
        <button
          type="submit"
          disabled={enviando}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {enviando ? "Reservando..." : "Reservar Vuelo"}
        </button>
      </form>
    </div>
  );
}
