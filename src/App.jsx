import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Clientes from './pages/Clientes';
import Fidelizacion from './pages/Fidelizacion';
import Compras from './pages/Compras';
import Ventas from './pages/Ventas';
import Inventario from './pages/Inventario';
import Proveedores from './pages/Proveedores';
import Usuario from './pages/Usuario';
import Productos from './pages/Productos';
import Sucursales from './pages/Sucursales';
import Login from './pages/Login';
import { AuthProvider } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RecuperarContrasena from './pages/RecuperarContrasena';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />

          {/* Redirección desde "/" a /home si está autenticado */}
          <Route path="/" element={
            <ProtectedRoute>
              <Navigate to="/home" replace />
            </ProtectedRoute>
          } />

          {/* Rutas protegidas */}
          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
           <Route path="/clientes" element={
            <ProtectedRoute>
              <Clientes />
            </ProtectedRoute>
          } />
          <Route path="/fidelizacion" element={
            <ProtectedRoute>
              <Fidelizacion />
            </ProtectedRoute>
          } />
          <Route path="/compras" element={
            <ProtectedRoute>
              <Compras />
            </ProtectedRoute>
          } />
          <Route path="/ventas" element={
            <ProtectedRoute>
              <Ventas />
            </ProtectedRoute>
          } />
          <Route path="/inventario" element={
            <ProtectedRoute>
              <Inventario />
            </ProtectedRoute>
          } />
          <Route path="/usuario" element={
            <ProtectedRoute>
              <Usuario />
            </ProtectedRoute>
          } />
          <Route path="/productos" element={
            <ProtectedRoute>
              <Productos />
            </ProtectedRoute>
          } />
          <Route path="/proveedores" element={
            <ProtectedRoute>
              <Proveedores />
            </ProtectedRoute>
          } />
          <Route path="/sucursales" element={
            <ProtectedRoute>
              <Sucursales />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
