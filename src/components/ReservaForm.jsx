import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { registrarReserva } from '../services/reservaService';

export default function ReservaForm({ vueloId, onReservaExitosa }) {
  const [clienteId, setClienteId] = useState(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      const usuario = JSON.parse(usuarioGuardado);
      setClienteId(usuario.id);
    } else {
      Swal.fire('Error', 'No se encontró el usuario en sesión', 'error');
    }
  }, []);

  const handleReserva = async (e) => {
    e.preventDefault();

    if (!clienteId || !vueloId) {
      Swal.fire('Error', 'Cliente o vuelo no válido.', 'error');
      return;
    }

    try {
      setEnviando(true);
      const res = await registrarReserva(clienteId, vueloId); // 👈 PASAMOS LOS DOS PARÁMETROS DIRECTAMENTE
      Swal.fire('¡Reserva exitosa!', 'Tu reserva ha sido registrada.', 'success');
      onReservaExitosa(res.data.id);
    } catch (error) {
      console.error('Error al registrar la reserva:', error);
      Swal.fire('Error', 'No se pudo realizar la reserva.', 'error');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow rounded-xl p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-4">✍️ Reservar Vuelo</h2>
      <form onSubmit={handleReserva} className="space-y-4">
        <button
          type="submit"
          disabled={enviando}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {enviando ? 'Reservando...' : 'Reservar Vuelo'}
        </button>
      </form>
    </div>
  );
}
