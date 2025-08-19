import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const usuarioGuardado = localStorage.getItem('usuario');
  let usuario;

  try {
    usuario = JSON.parse(usuarioGuardado);
  } catch {
    usuario = null;
  }

  if (!usuario || !usuario.id) {
    return <Navigate to="/login" replace />;
  }

  return children;
}