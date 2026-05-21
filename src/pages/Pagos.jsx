import { useEffect, useState } from "react";
import { obtenerReservas, obtenerReservaPorId } from "../services/reservaService";
import { registrarPago, obtenerPagos } from "../services/pagoService";
import Swal from "sweetalert2";

export default function Pagos() {
  const [usuario, setUsuario] = useState(null);
  const [reservasCliente, setReservasCliente] = useState([]);
  const [pagosRealizados, setPagosRealizados] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search Reservation State
  const [searchId, setSearchId] = useState("");
  const [searchedReserva, setSearchedReserva] = useState(null);
  const [searching, setSearching] = useState(false);

  // Active Payment State
  const [selectedReserva, setSelectedReserva] = useState(null);
  const [metodoPago, setMetodoPago] = useState("Tarjeta");
  const [pagando, setPagando] = useState(false);

  // Load user and payments
  const cargarDatos = async () => {
    setLoading(true);
    try {
      const userData = localStorage.getItem("usuario");
      let currentUser = null;
      if (userData) {
        currentUser = JSON.parse(userData);
        setUsuario(currentUser);
      }

      // Fetch all system bookings and payments
      const [resReservas, resPagos] = await Promise.all([
        obtenerReservas(),
        obtenerPagos(),
      ]);

      const allReservas = resReservas.data || [];
      const allPagos = resPagos.data || [];
      setPagosRealizados(allPagos);

      // Filter reservations for current client
      if (currentUser && currentUser.cliente) {
        const filtradas = allReservas.filter(
          (r) => r.cliente && r.cliente.id === currentUser.cliente.id
        );
        setReservasCliente(filtradas);
      } else {
        setReservasCliente([]);
      }
    } catch (err) {
      console.error("Error al cargar datos de pago:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Check if reservation is paid
  const esReservaPagada = (reservaId) => {
    return pagosRealizados.some(
      (p) => p.reserva && p.reserva.id === reservaId
    );
  };

  // Search reservation manually by ID
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchId) return;

    setSearching(true);
    setSearchedReserva(null);
    try {
      const res = await obtenerReservaPorId(searchId);
      if (res.data) {
        setSearchedReserva(res.data);
        setSelectedReserva(res.data);
      } else {
        Swal.fire("Reserva no encontrada", "El ID ingresado no coincide con ninguna reserva activa.", "warning");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error en búsqueda", "No se encontró la reserva con ID " + searchId, "error");
    } finally {
      setSearching(false);
    }
  };

  // Process live payment
  const handleRealizarPago = async (e) => {
    e.preventDefault();
    if (!selectedReserva) return;

    const monto = selectedReserva.vuelo?.precio || selectedReserva.vuelo?.valor || 0;
    
    setPagando(true);
    try {
      await registrarPago(selectedReserva.id, monto, metodoPago);
      
      Swal.fire({
        icon: "success",
        title: "¡Pago Confirmado!",
        text: `Se ha registrado el pago de la reserva #${selectedReserva.id} por valor de $${monto.toLocaleString()} COP.`,
        confirmButtonColor: "#10b981",
      });

      // Reset states and refresh
      setSelectedReserva(null);
      setSearchedReserva(null);
      setSearchId("");
      cargarDatos();
    } catch (err) {
      console.error(err);
      Swal.fire("Error en transacción", "Hubo un error al procesar el pago en el servidor.", "error");
    } finally {
      setPagando(false);
    }
  };

  const formatMoney = (val) => {
    return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-16">
      {/* Glow effect */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
            💳 Pasarela de Pagos AeroFly
          </h1>
          <p className="mt-2 text-slate-400 text-lg">
            Realiza el pago de tus tiquetes aéreos de forma segura utilizando múltiples canales digitales.
          </p>
        </div>

        {/* Dashboard grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Client Bookings & Manual Search */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Box 1: Search Reservation */}
            <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 shadow-xl">
              <h2 className="text-xl font-bold mb-4 text-blue-400 flex items-center gap-2">
                🔍 Buscar Reserva Manualmente
              </h2>
              <form onSubmit={handleSearch} className="flex gap-4">
                <input
                  type="number"
                  placeholder="Introduce el código de tu reserva (Ej. 5)"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition"
                  required
                />
                <button
                  type="submit"
                  disabled={searching}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2.5 rounded-xl transition shadow-md active:scale-95"
                >
                  {searching ? "Buscando..." : "Buscar"}
                </button>
              </form>
            </div>

            {/* Box 2: Client Active Reservations */}
            <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 shadow-xl">
              <h2 className="text-xl font-bold mb-6 text-indigo-400 flex items-center gap-2">
                📅 Mis Reservas Activas
              </h2>

              {!usuario ? (
                <div className="p-6 text-center bg-slate-900/30 rounded-xl border border-slate-700/30">
                  <p className="text-slate-400">Inicia sesión como cliente para ver tu listado de reservas.</p>
                </div>
              ) : loading ? (
                <div className="py-12 flex justify-center">
                  <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : reservasCliente.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900/50 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-700/50">
                        <th className="py-3 px-4">Código</th>
                        <th className="py-3 px-4">Ruta (Vuelo)</th>
                        <th className="py-3 px-4">Valor</th>
                        <th className="py-3 px-4">Estado</th>
                        <th className="py-3 px-4 text-center">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/40 text-sm">
                      {reservasCliente.map((res) => {
                        const pagada = esReservaPagada(res.id);
                        const precio = res.vuelo?.precio || res.vuelo?.valor || 0;
                        return (
                          <tr key={res.id} className="hover:bg-slate-700/20 transition">
                            <td className="py-4 px-4 font-mono font-bold text-blue-400">#{res.id}</td>
                            <td className="py-4 px-4 text-slate-200">
                              {res.vuelo ? (
                                <span>{res.vuelo.origen} ✈️ {res.vuelo.destino}</span>
                              ) : (
                                "Detalle no disponible"
                              )}
                            </td>
                            <td className="py-4 px-4 font-semibold text-white">{formatMoney(precio)}</td>
                            <td className="py-4 px-4">
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                pagada
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              }`}>
                                {pagada ? "Pagada ✅" : "Pendiente ⚠️"}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-center">
                              {!pagada ? (
                                <button
                                  onClick={() => setSelectedReserva(res)}
                                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow transition"
                                >
                                  Pagar Ahora 💳
                                </button>
                              ) : (
                                <span className="text-slate-500 text-xs font-medium">Pago registrado</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-6 text-center bg-slate-900/30 rounded-xl border border-slate-700/30">
                  <p className="text-slate-400">No tienes ninguna reserva registrada a tu nombre.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Checkout Widget */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 shadow-2xl relative sticky top-8">
              <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2 border-b border-slate-700 pb-3">
                🛒 Detalles del Pago
              </h2>

              {selectedReserva ? (
                <form onSubmit={handleRealizarPago} className="space-y-6">
                  {/* Flight Info Card */}
                  <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30 space-y-3">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Reserva</p>
                      <h4 className="text-lg font-bold text-white font-mono">Código #{selectedReserva.id}</h4>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Pasajero</p>
                      <p className="text-sm font-medium text-slate-200">{selectedReserva.cliente?.nombre || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Vuelo</p>
                      <p className="text-sm font-semibold text-blue-400">
                        {selectedReserva.vuelo ? (
                          <span>{selectedReserva.vuelo.origen} ➡️ {selectedReserva.vuelo.destino}</span>
                        ) : (
                          "Detalles no disponibles"
                        )}
                      </p>
                    </div>
                    <div className="border-t border-slate-700/30 pt-3 flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-300">Total a Pagar:</span>
                      <span className="text-xl font-extrabold text-emerald-400">
                        {formatMoney(selectedReserva.vuelo?.precio || selectedReserva.vuelo?.valor || 0)}
                      </span>
                    </div>
                  </div>

                  {/* Payment Channel */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Canal / Método de Pago *
                    </label>
                    <select
                      value={metodoPago}
                      onChange={(e) => setMetodoPago(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition"
                    >
                      <option value="Tarjeta de Crédito">💳 Tarjeta de Crédito/Débito</option>
                      <option value="Nequi">📱 Nequi</option>
                      <option value="Daviplata">📱 Daviplata</option>
                      <option value="PSE">🏦 PSE (Cuenta de Ahorros)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={pagando}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 rounded-xl transition duration-200 shadow-lg hover:shadow-emerald-600/10 active:scale-98"
                  >
                    {pagando ? "Procesando Transacción..." : "Proceder al Pago Seguro 🔒"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedReserva(null);
                      setSearchedReserva(null);
                      setSearchId("");
                    }}
                    className="w-full text-center text-slate-400 hover:text-white text-xs font-semibold mt-2 transition"
                  >
                    Cancelar Selección
                  </button>
                </form>
              ) : (
                <div className="py-16 text-center flex flex-col items-center justify-center text-slate-500">
                  <span className="text-4xl mb-3">🛒</span>
                  <p className="text-sm px-4">
                    Selecciona una reserva de tu listado o realiza una búsqueda manual por ID para habilitar el checkout.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}