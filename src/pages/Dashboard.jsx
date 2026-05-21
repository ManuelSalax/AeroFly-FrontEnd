import { useEffect, useState } from 'react';
import { obtenerVuelos, crearVuelo } from '../services/vueloService';
import { obtenerUsuarios } from '../services/usuarioService';
import { obtenerPagos } from '../services/pagoService';
import Swal from 'sweetalert2';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('vuelos');
  const [vuelos, setVuelos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form State for new flight
  const [flightForm, setFlightForm] = useState({
    origen: '',
    destino: '',
    fechaSalida: '',
    fechaLlegada: '',
    capacidad: 100,
    precio: '',
  });

  // Fetch all dashboard data
  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [resVuelos, resUsuarios, resPagos] = await Promise.all([
        obtenerVuelos(),
        obtenerUsuarios(),
        obtenerPagos(),
      ]);
      setVuelos(resVuelos.data || []);
      setUsuarios(resUsuarios.data || []);
      setPagos(resPagos.data || []);
    } catch (err) {
      console.error('Error al cargar datos del dashboard:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error de Conexión',
        text: 'Hubo un error al conectar con el servidor Spring Boot.',
        confirmButtonColor: '#1d4ed8',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFlightForm({
      ...flightForm,
      [name]: name === 'capacidad' || name === 'precio' ? Number(value) : value,
    });
  };

  // Submit new flight
  const handleAddFlight = async (e) => {
    e.preventDefault();

    // Validations
    if (!flightForm.origen || !flightForm.destino || !flightForm.fechaSalida || !flightForm.fechaLlegada || !flightForm.precio) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor llena todos los campos obligatorios.',
        confirmButtonColor: '#eab308',
      });
      return;
    }

    if (flightForm.capacidad <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Capacidad inválida',
        text: 'La capacidad debe ser mayor que 0.',
        confirmButtonColor: '#eab308',
      });
      return;
    }

    if (flightForm.precio <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Precio inválido',
        text: 'El precio debe ser un número positivo.',
        confirmButtonColor: '#eab308',
      });
      return;
    }

    // Format dates to LocalDateTime string e.g. "YYYY-MM-DDTHH:MM:SS"
    const parsedSalida = new Date(flightForm.fechaSalida).toISOString().split('.')[0];
    const parsedLlegada = new Date(flightForm.fechaLlegada).toISOString().split('.')[0];

    const newFlightPayload = {
      origen: flightForm.origen,
      destino: flightForm.destino,
      fechaSalida: parsedSalida,
      fechaLlegada: parsedLlegada,
      capacidad: parseInt(flightForm.capacidad),
      precio: parseFloat(flightForm.precio),
    };

    try {
      await crearVuelo(newFlightPayload);
      Swal.fire({
        icon: 'success',
        title: '¡Vuelo Agregado!',
        text: `El vuelo de ${flightForm.origen} a ${flightForm.destino} se ha creado correctamente.`,
        confirmButtonColor: '#10b981',
        timer: 3000,
      });

      // Reset form and reload
      setFlightForm({
        origen: '',
        destino: '',
        fechaSalida: '',
        fechaLlegada: '',
        capacidad: 100,
        precio: '',
      });
      setModalOpen(false);
      cargarDatos();
    } catch (err) {
      console.error('Error al guardar vuelo:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error al crear vuelo',
        text: 'No se pudo guardar el vuelo en el backend. Revisa los datos e intenta de nuevo.',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  // Stats Counters
  const totalVuelos = vuelos.length;
  const totalUsuarios = usuarios.length;
  const totalIngresos = pagos.reduce((acc, curr) => acc + (curr.monto || 0), 0);

  // Formatter helpers
  const formatMoney = (val) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('es-CO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-16">
      {/* Upper Glowing Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 px-6 py-12 shadow-2xl border-b border-indigo-900/50">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 -mb-12 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-10"></div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-white bg-clip-text text-transparent">
              Panel de Administración AeroFly
            </h1>
            <p className="mt-2 text-slate-400 text-lg max-w-xl">
              Monitorea en tiempo real los vuelos, usuarios registrados y flujos financieros de tu aerolínea.
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <span className="text-xl">➕</span> Agregar Nuevo Vuelo
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Statistics Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1 */}
          <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 shadow-xl flex items-center gap-4 hover:border-blue-500/30 transition duration-300">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 text-2xl font-bold">
              ✈️
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Total de Vuelos</p>
              <h3 className="text-3xl font-extrabold mt-1 text-white">
                {loading ? <span className="animate-pulse">...</span> : totalVuelos}
              </h3>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 shadow-xl flex items-center gap-4 hover:border-indigo-500/30 transition duration-300">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 text-2xl font-bold">
              👥
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Usuarios Registrados</p>
              <h3 className="text-3xl font-extrabold mt-1 text-white">
                {loading ? <span className="animate-pulse">...</span> : totalUsuarios}
              </h3>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 shadow-xl flex items-center gap-4 hover:border-emerald-500/30 transition duration-300">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-2xl font-bold">
              💰
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Ventas e Ingresos</p>
              <h3 className="text-3xl font-extrabold mt-1 text-emerald-400">
                {loading ? <span className="animate-pulse">...</span> : formatMoney(totalIngresos)}
              </h3>
            </div>
          </div>
        </div>

        {/* Tab Selection (Glassmorphism design) */}
        <div className="bg-slate-800/50 p-1.5 rounded-xl border border-slate-700/50 max-w-md flex mb-8">
          <button
            onClick={() => setActiveTab('vuelos')}
            className={`flex-1 py-2 text-center rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === 'vuelos'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ✈️ Vuelos
          </button>
          <button
            onClick={() => setActiveTab('usuarios')}
            className={`flex-1 py-2 text-center rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === 'usuarios'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            👥 Usuarios
          </button>
          <button
            onClick={() => setActiveTab('pagos')}
            className={`flex-1 py-2 text-center rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === 'pagos'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            💳 Pagos
          </button>
        </div>

        {/* Table View Component */}
        <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-slate-400 font-medium">Sincronizando base de datos...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              
              {/* TAB 1: VUELOS */}
              {activeTab === 'vuelos' && (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/50 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-700/50">
                      <th className="py-4 px-6">ID</th>
                      <th className="py-4 px-6">Origen</th>
                      <th className="py-4 px-6">Destino</th>
                      <th className="py-4 px-6">Salida</th>
                      <th className="py-4 px-6">Llegada</th>
                      <th className="py-4 px-6">Capacidad</th>
                      <th className="py-4 px-6 text-right">Precio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/40 text-sm">
                    {vuelos.length > 0 ? (
                      vuelos.map((v) => (
                        <tr key={v.id} className="hover:bg-slate-700/20 transition">
                          <td className="py-4 px-6 font-mono text-blue-400 font-semibold">#{v.id}</td>
                          <td className="py-4 px-6 font-medium text-white">{v.origen}</td>
                          <td className="py-4 px-6 font-medium text-white">✈️ {v.destino}</td>
                          <td className="py-4 px-6 text-slate-300">{formatDate(v.fechaSalida)}</td>
                          <td className="py-4 px-6 text-slate-300">{formatDate(v.fechaLlegada)}</td>
                          <td className="py-4 px-6">
                            <span className="bg-indigo-500/10 text-indigo-300 px-3 py-1 rounded-full text-xs font-medium border border-indigo-500/20">
                              {v.capacidad} pasajeros
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right font-bold text-emerald-400">{formatMoney(v.precio)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="py-12 px-6 text-center text-slate-400">
                          No hay vuelos disponibles en el sistema.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}

              {/* TAB 2: USUARIOS */}
              {activeTab === 'usuarios' && (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/50 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-700/50">
                      <th className="py-4 px-6">ID Usuario</th>
                      <th className="py-4 px-6">Username / Cuenta</th>
                      <th className="py-4 px-6">Nombre del Cliente</th>
                      <th className="py-4 px-6">Email de Contacto</th>
                      <th className="py-4 px-6">Rol del Sistema</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/40 text-sm">
                    {usuarios.length > 0 ? (
                      usuarios.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-700/20 transition">
                          <td className="py-4 px-6 font-mono text-indigo-400 font-semibold">#{u.id}</td>
                          <td className="py-4 px-6 text-white font-medium">👤 {u.username}</td>
                          <td className="py-4 px-6 text-slate-200">{u.cliente?.nombre || 'N/A (Admin/Sin Perfil)'}</td>
                          <td className="py-4 px-6 text-slate-300 font-mono text-xs">{u.cliente?.email || 'N/A'}</td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                              u.rol === 'ADMIN'
                                ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                : 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                            }`}>
                              {u.rol}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="py-12 px-6 text-center text-slate-400">
                          No hay usuarios registrados en el sistema.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}

              {/* TAB 3: PAGOS */}
              {activeTab === 'pagos' && (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/50 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-700/50">
                      <th className="py-4 px-6">ID Pago</th>
                      <th className="py-4 px-6">ID Reserva</th>
                      <th className="py-4 px-6">Cliente</th>
                      <th className="py-4 px-6">Origen → Destino</th>
                      <th className="py-4 px-6">Método de Pago</th>
                      <th className="py-4 px-6">Fecha de Pago</th>
                      <th className="py-4 px-6 text-right">Monto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/40 text-sm">
                    {pagos.length > 0 ? (
                      pagos.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-700/20 transition">
                          <td className="py-4 px-6 font-mono text-emerald-400 font-semibold">#{p.id}</td>
                          <td className="py-4 px-6 font-mono text-slate-400">#{p.reserva?.id || 'N/A'}</td>
                          <td className="py-4 px-6 font-medium text-white">{p.reserva?.cliente?.nombre || 'Cliente Anónimo'}</td>
                          <td className="py-4 px-6 text-slate-300">
                            {p.reserva?.vuelo ? (
                              <span>{p.reserva.vuelo.origen} ➡️ {p.reserva.vuelo.destino}</span>
                            ) : (
                              'N/A'
                            )}
                          </td>
                          <td className="py-4 px-6">
                            <span className="bg-slate-700 text-slate-200 px-3 py-1 rounded-full text-xs font-semibold border border-slate-600">
                              💳 {p.metodoPago}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-slate-300 font-mono text-xs">{p.fechaPago}</td>
                          <td className="py-4 px-6 text-right font-extrabold text-emerald-400">{formatMoney(p.monto)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="py-12 px-6 text-center text-slate-400">
                          No hay transacciones registradas.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}

            </div>
          )}
        </div>
      </div>

      {/* CREATE FLIGHT MODAL (Glassmorphic design overlay) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto">
          {/* Backdrop blur */}
          <div
            onClick={() => setModalOpen(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
          ></div>

          {/* Modal Container */}
          <div className="relative bg-slate-800 rounded-3xl border border-slate-700 max-w-lg w-full p-8 shadow-2xl z-10 transform scale-100 transition-all">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                ✈️ Registrar Nuevo Vuelo
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white transition text-2xl font-bold bg-slate-700/50 hover:bg-slate-700 w-8 h-8 rounded-full flex items-center justify-center"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddFlight} className="space-y-5">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Origen *</label>
                  <input
                    type="text"
                    name="origen"
                    placeholder="Ej. Bogotá"
                    value={flightForm.origen}
                    onChange={handleInputChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Destino *</label>
                  <input
                    type="text"
                    name="destino"
                    placeholder="Ej. Medellín"
                    value={flightForm.destino}
                    onChange={handleInputChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Fecha y Hora de Salida *</label>
                <input
                  type="datetime-local"
                  name="fechaSalida"
                  value={flightForm.fechaSalida}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Fecha y Hora de Llegada *</label>
                <input
                  type="datetime-local"
                  name="fechaLlegada"
                  value={flightForm.fechaLlegada}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Capacidad (Pasajeros) *</label>
                  <input
                    type="number"
                    name="capacidad"
                    value={flightForm.capacidad}
                    onChange={handleInputChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Precio del Boleto (COP) *</label>
                  <input
                    type="number"
                    name="precio"
                    placeholder="Ej. 250000"
                    value={flightForm.precio}
                    onChange={handleInputChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-slate-700 hover:bg-slate-650 text-slate-200 px-5 py-2.5 rounded-xl font-semibold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-2.5 rounded-xl font-semibold transition shadow-md"
                >
                  Registrar Vuelo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
