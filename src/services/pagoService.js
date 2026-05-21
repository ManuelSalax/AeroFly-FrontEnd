import axios from "axios";

export async function registrarPago(reservaId, monto, metodoPago) {
  console.log("📦 Enviando pago:", { reservaId, monto, metodoPago });

  // Se envían como query parameters (?reservaId=X&monto=Y&metodoPago=Z)
  return await axios.post("http://localhost:8080/api/pagos", null, {
    params: {
      reservaId: Number(reservaId),
      monto: Number(monto),
      metodoPago: metodoPago
    }
  });
}

export async function obtenerPagos() {
  return await axios.get("http://localhost:8080/api/pagos");
}
