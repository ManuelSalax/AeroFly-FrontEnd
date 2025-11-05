import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { buscarPorId } from '../services/vueloService';
import ReservaForm from '../components/ReservaForm';
import PagoForm from '../components/PagoForm';
import DetallesReserva from '../components/DetallesReserva';

export default function VueloDetalles() {
  const { id } = useParams();
  const [vuelo, setVuelo] = useState(null);
  const [reservaId, setReservaId] = useState(null);
  const [cliente, setCliente] = useState(null); // datos del cliente desde la API
  const [usuario, setUsuario] = useState(null); // datos del usuario logueado
  const [mostrarDetallesReserva, setMostrarDetallesReserva] = useState(false);
  const [mostrarPago, setMostrarPago] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔹 Buscar vuelo por ID
    buscarPorId(id)
      .then(response => setVuelo(response.data))
      .catch(() => Swal.fire('Error', 'No se pudo cargar el vuelo.', 'error'))
      .finally(() => setLoading(false));

    // 🔹 Cargar usuario desde localStorage (login)
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      try {
        const parsedUser = JSON.parse(usuarioGuardado);
        setUsuario(parsedUser);
      } catch (err) {
        console.error("Error al leer el usuario:", err);
      }
    }
  }, [id]);

  if (loading) {
    return <div className="text-center mt-10 text-gray-600">Cargando información del vuelo...</div>;
  }

  if (!vuelo) {
    return <div className="text-center mt-10 text-red-600">No se encontró información del vuelo.</div>;
  }

  return (
    <div className="min-h-screen p-8 bg-blue-50 text-gray-800">
      {/* 🛫 Detalles del vuelo */}
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6 mb-10">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">🛫 Vuelo a {vuelo.destino}</h1>
        <p><strong>🛬 Origen:</strong> {vuelo.origen}</p>
        <p><strong>📅 Fechas:</strong> {vuelo.fechaSalida} - {vuelo.fechaLlegada}</p>
        <p><strong>💲 Precio:</strong> ${vuelo.precio?.toLocaleString()}</p>
        <p><strong>📝 Descripción:</strong> {vuelo.descripcion}</p>
      </div>

      {/* ✈️ Flujo dinámico */}
      {!mostrarDetallesReserva && !mostrarPago && (
        <ReservaForm
          vueloId={id}
          onReservaExitosa={(idReserva) => {
            setReservaId(idReserva);
            // Simulación: el cliente logueado será el mismo usuario
            // (aquí podrías consultar el cliente real si lo necesitas)
            setCliente({
              nombre: usuario?.nombre || usuario?.username || 'Cliente sin nombre',
            });
            setMostrarDetallesReserva(true);
          }}
        />
      )}

      {mostrarDetallesReserva && cliente && usuario && (
        <DetallesReserva
          cliente={cliente}
          usuario={usuario}
          vuelo={vuelo}
          onContinuarPago={() => {
            setMostrarDetallesReserva(false);
            setMostrarPago(true);
          }}
        />
      )}

      {mostrarPago && reservaId && (
        <PagoForm reservaId={reservaId} />
      )}
    </div>
  );
}
