import { Navigate } from 'react-router-dom';

export default function AdminRoute({ children }) {
  const usuarioGuardado = localStorage.getItem('usuario');
  let usuario;

  try {
    usuario = JSON.parse(usuarioGuardado);
  } catch {
    usuario = null;
  }

  // Si no está autenticado o no es ADMIN, redirige a login
  if (!usuario || !usuario.id || usuario.rol !== 'ADMIN') {
    return <Navigate to="/login" replace />;
  }

  return children;
}
