import axios from "axios";

export async function registrarPago(reservaId, monto, metodoPago) {
  const payload = { reservaId, monto, metodoPago };
  console.log("📦 Enviando pago:", payload);

  return await axios.post("http://localhost:8080/api/pagos", payload, {
    headers: { "Content-Type": "application/json" },
  });
}
