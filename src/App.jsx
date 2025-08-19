import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Vuelos from './pages/Vuelos';
import Reservas from './pages/Reservas';
import Pagos from './pages/Pagos';
import InfoPage from './pages/InfoPage';
import RegistroForm from './pages/RegistroForm';
import Login from './pages/Login';
import VueloDetalles from './pages/VueloDetalles';
import PrivateRoute from './components/PrivateRoute';

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<InfoPage />} />
        <Route path="/vuelos" element={<Vuelos />} />
        <Route
          path="/vuelos/:id"
          element={
            <PrivateRoute>
              <VueloDetalles />
            </PrivateRoute>
          }
        />
        <Route path="/reservas" element={<Reservas />} />
        <Route path="/pagos" element={<Pagos />} />
        <Route path="/info" element={<InfoPage />} />
        <Route path="/registro" element={<RegistroForm />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}