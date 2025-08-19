import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { buscarPorId } from '../services/vueloService';
import ReservaForm from '../components/ReservaForm';
import PagoForm from '../components/PagoForm';

export default function VueloDetalles() {
  const { id } = useParams();
  const [vuelo, setVuelo] = useState(null);
  const [clienteId, setClienteId] = useState('');
  const [reservaId, setReservaId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    try {
      const usuario = JSON.parse(usuarioGuardado);
      if (usuario?.id) {
        setClienteId(usuario.id);
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      console.warn("Usuario inválido en localStorage");
    }

    buscarPorId(id)
      .then(response => {
        setVuelo(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error al buscar vuelo:", error);
        setLoading(false);
        Swal.fire('Error', 'No se pudo cargar la información del vuelo.', 'error');
      });
  }, [id]);

  if (loading) {
    return <div className="text-center mt-10 text-gray-600">Cargando información del vuelo...</div>;
  }

  if (!vuelo) {
    return <div className="text-center mt-10 text-red-600">No se encontró información del vuelo.</div>;
  }

  return (
    <div className="min-h-screen p-8 bg-blue-50 text-gray-800">
      {/* Detalles del vuelo */}
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6 mb-10">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">🛫 Vuelo a {vuelo.destino}</h1>
        <p><strong>🛬 Origen:</strong> {vuelo.origen}</p>
        <p><strong>📅 Fechas:</strong> {vuelo.fechaInicio} - {vuelo.fechaFin}</p>
        <p><strong>💲 Precio:</strong> ${vuelo.precio?.toLocaleString()}</p>
        <p><strong>📝 Descripción:</strong> {vuelo.descripcion}</p>
      </div>

      {/* Componente de reserva */}
      <ReservaForm clienteId={clienteId} vueloId={id} onReservaExitosa={setReservaId} />

      {/* Componente de pago */}
      <PagoForm reservaId={reservaId} />
    </div>
  );
}