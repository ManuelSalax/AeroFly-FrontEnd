import { useState } from 'react';
import Swal from 'sweetalert2';
import { registrarPago } from '../services/pagoServices';

export default function PagoForm({ reservaId }) {
  const [monto, setMonto] = useState('');
  const [metodoPago, setMetodoPago] = useState('TARJETA');
  const [enviando, setEnviando] = useState(false);

  const handlePago = async (e) => {
    e.preventDefault();
    if (!reservaId) {
      return Swal.fire('Atención', 'Primero debes realizar una reserva.', 'warning');
    }

    const pago = {
      reservaId: reservaId,
      monto: parseFloat(monto),
      fechaPago: new Date().toISOString().split('T')[0],
      metodoPago: metodoPago,
    };

    setEnviando(true);
    try {
      await registrarPago(pago);
      Swal.fire('¡Pago realizado!', 'Tu pago fue exitoso.', 'success');
    } catch {
      Swal.fire('Error', 'No se pudo procesar el pago.', 'error');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={handlePago} className="space-y-4">
      <input
        type="number"
        placeholder="Monto"
        value={monto}
        onChange={(e) => setMonto(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <select
        value={metodoPago}
        onChange={(e) => setMetodoPago(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="TARJETA">Tarjeta</option>
        <option value="EFECTIVO">Efectivo</option>
      </select>
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        disabled={enviando}
      >
        {enviando ? 'Procesando...' : 'Pagar'}
      </button>
    </form>
  );
}
