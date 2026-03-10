import { useUsuarioStore } from "../store/usuarioStore";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import ModalFactura from "./ModalFactura"; 

function Layout() {
  const usuario = useUsuarioStore((state) => state.usuario);
  const logout = useUsuarioStore((state) => state.logout);
  const navigate = useNavigate();
  const location = useLocation();
  const [mostrarModal, setMostrarModal] = useState(false);

  if (!usuario) {
    navigate("/", { replace: true }); // evita volver atrás
    return null;
  }

  const handleLogout = () => {
    logout(); // limpia store y localStorage
    navigate("/", { replace: true }); // redirige al login
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center">
        <div>
          <p className="font-bold">{usuario.correo}</p>
          <p className="text-sm">Rol: {usuario.rol}</p>
        </div>
        <div className="space-x-4">
          <Link to="/facturacion" className="hover:underline">Facturación</Link>
          <Link to="/facturacion/clientes/crear-sunat">Clientes</Link>
          <Link to="/facturacion/productos" className="hover:underline">Productos</Link> 
          <Link to="/facturacion/configuracion" className="hover:underline">Configuración</Link> 
          <button onClick={handleLogout} className="hover:underline text-red-200">
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="p-4 flex-1">
        <Outlet />
      </div>

      {/* Botón flotante solo en facturación */}
      {location.pathname === "/facturacion" && (
        <button
          onClick={() => setMostrarModal(true)}
          className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-green-700"
        >
          Nuevo Comprobante
        </button>
      )}

      {/* Modal */}
      {mostrarModal && (
        <ModalFactura onClose={() => setMostrarModal(false)} />
      )}
    </div>
  );
}

export default Layout;
