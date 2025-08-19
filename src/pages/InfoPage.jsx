export default function InfoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white text-gray-800">
      {/* Logo AeroFly */}
      <section className="py-6 px-8 flex justify-center items-center">
        <div className="flex items-center gap-3 text-blue-700 font-extrabold text-3xl">
          <img
            src="/src/assets/avion_sin_fondo.png" // si lo tienes en /public
            alt="AeroFly Logo"
            className="h-12 w-auto"
          />
          AeroFly
        </div>
      </section>

      {/* Hero Section con fondo real */}
      <section
        className="flex flex-col items-center justify-center text-center py-20 px-6 bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1950&q=80")',
        }}
      >
        <h1 className="text-5xl font-extrabold text-white drop-shadow-lg">
          Vuela alto con AeroFly 
          <img src="/src/assets/avion_sin_fondo.png" alt="" />
        </h1>
        <p className="mt-4 text-xl text-white max-w-2xl">
          La nueva forma de conquistar los cielos. Viajes seguros, destinos de
          ensueño y una experiencia inolvidable desde el primer clic.
        </p>
        <div className="mt-6 flex gap-4">
          <a
            href="/reservas"
            className="bg-white text-blue-600 font-semibold px-6 py-2 rounded-xl shadow-lg hover:bg-blue-100 transition"
          >
            Reservar ahora
          </a>
          <a
            href="/vuelos"
            className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:bg-blue-700 transition"
          >
            Ver destinos
          </a>
        </div>
      </section>

      {/* ¿Por qué AeroFly? */}
      <section className="py-16 px-8 text-center">
        <h2 className="text-4xl font-bold mb-6 text-blue-800">
          ¿Por qué elegir AeroFly?
        </h2>
        <p className="max-w-3xl mx-auto mb-10">
          En AeroFly redefinimos tu experiencia de vuelo. Somos más que una
          aerolínea: somos tu compañero de viaje.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-2xl shadow-md">
            <h3 className="text-xl font-semibold mb-2">
              ✈️ Vuelos nacionales e internacionales
            </h3>
            <p>Amplia cobertura para que llegues a donde sueñas.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-md">
            <h3 className="text-xl font-semibold mb-2">📱 Reservas rápidas</h3>
            <p>Haz todo desde tu celular u ordenador en minutos.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-md">
            <h3 className="text-xl font-semibold mb-2">💳 Pagos seguros</h3>
            <p>Diversos métodos con seguridad garantizada.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-md">
            <h3 className="text-xl font-semibold mb-2">🛬 Itinerarios claros</h3>
            <p>Consulta tus vuelos y horarios al instante.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-md">
            <h3 className="text-xl font-semibold mb-2">💼 Atención 24/7</h3>
            <p>Te acompañamos antes, durante y después del viaje.</p>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="bg-blue-50 py-16 px-8 text-center">
        <h2 className="text-4xl font-bold text-blue-800 mb-8">
          Experiencia del pasajero
        </h2>
        <blockquote className="italic text-lg max-w-2xl mx-auto">
          “Viajar con AeroFly fue como volar en primera clase, incluso sin
          pagarla.”<br />
          <span className="text-sm">— María Fernández, viajera frecuente</span>
        </blockquote>
      </section>

      {/* Contacto */}
      <section className="py-16 px-8 text-center">
        <h2 className="text-4xl font-bold text-blue-800 mb-6">Contáctanos</h2>
        <p className="mb-4">📧 contacto@aerofly.com</p>
        <p className="mb-4">📞 +57 320 456 7890</p>
        <p>📍 Medellín, Colombia</p>
      </section>
    </div>
  );
}