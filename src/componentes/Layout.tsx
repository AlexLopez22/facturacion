import { useUsuarioStore } from "../store/usuarioStore";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import ModalFactura from "./ModalFactura";
import { DocumentTextIcon, CubeIcon, UsersIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon, PowerIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/solid";

function Layout() {
  const usuario = useUsuarioStore((state) => state.usuario);
  const logout = useUsuarioStore((state) => state.logout);
  const navigate = useNavigate();
  const location = useLocation();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [sidebarFijo, setSidebarFijo] = useState(false);
  const [hoverActivo, setHoverActivo] = useState(false);
  const expandido = sidebarFijo || hoverActivo;

  if (!usuario) {
    navigate("/", { replace: true }); // evita volver atrás
    return null;
  }

  const handleLogout = () => {
    logout(); // limpia store y localStorage
    navigate("/", { replace: true }); // redirige al login
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar translúcido */}
      <aside
        onMouseEnter={() => !sidebarFijo && setHoverActivo(true)}
        onMouseLeave={() => !sidebarFijo && setHoverActivo(false)}
        className={`${expandido ? "w-48" : "w-20"
          } ml-4 my-6 bg-blue-100/40 backdrop-blur-lg border border-blue-300/40 rounded-xl flex flex-col transition-all duration-300 shadow-lg`}
      >
        {/* Usuario */}
        <div className="p-4 border-b border-blue-200/40 flex items-center justify-center">
          {expandido ? (
            <div>
              <p className="font-bold text-gray-800">{usuario?.correo}</p>
              <p className="text-sm text-blue-700">Rol: {usuario?.rol}</p>
            </div>
          ) : (
            <UserCircleIcon className="h-6 w-6 text-gray-700" />
          )}
        </div>

        {/* Menú */}
        <nav
          className={`flex-1 p-2 space-y-2 ${expandido
            ? "text-blue-700"
            : "flex flex-col items-center text-blue-700"
            }`}
        >
          <Link
            to="/facturacion"
            className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/30 transition"
          >
            <DocumentTextIcon className="h-6 w-6 text-gray-700 hover:text-blue-700" />
            {expandido && (
              <span className="text-gray-800 hover:text-blue-700">Facturación</span>
            )}
          </Link>

          <Link
            to="/facturacion/productos"
            className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/30 transition"
          >
            <CubeIcon className="h-6 w-6 text-gray-700 hover:text-blue-700" />
            {expandido && (
              <span className="text-gray-800 hover:text-blue-700">Productos</span>
            )}
          </Link>

          <Link
            to="/facturacion/clientes"
            className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/30 transition"
          >
            <UsersIcon className="h-6 w-6 text-gray-700 hover:text-blue-700" />
            {expandido && (
              <span className="text-gray-800 hover:text-blue-700">Clientes</span>
            )}
          </Link>

          <Link
            to="/facturacion/configuracion"
            className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/30 transition"
          >
            <Cog6ToothIcon className="h-6 w-6 text-gray-700 hover:text-blue-700" />
            {expandido && (
              <span className="text-gray-800 hover:text-blue-700">Configuración</span>
            )}
          </Link>
        </nav>

        {/* Toggle + Logout */}
        <div className="p-4 border-t border-blue-200/40 flex flex-col items-center gap-2">
          {/* Botón hamburguesa */}
          <button
            onClick={() => setSidebarFijo(!sidebarFijo)}
            className="flex items-center justify-center text-gray-700 hover:text-blue-700 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center justify-center text-red-600 hover:text-red-800 transition"
          >
            <PowerIcon className="h-6 w-6" />
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 px-4 py-6">

        {/* HEADER SUPERIOR */}
        {location.pathname === "/facturacion" && (
          <div className="flex items-center justify-between mb-4">

            <h2 className="text-2xl font-bold text-slate-800">
              Comprobantes emitidos
            </h2>
            <button
              onClick={() => setMostrarModal(true)}
              className="flex items-center gap-2 px-4 h-[34px] text-sm rounded-md 
                   bg-slate-800 text-white hover:bg-slate-900 transition shadow"
            >
              <PlusIcon className="h-4 w-4" />
              Nuevo Comprobante
            </button>
          </div>
        )}
        {/* OTROS TÍTULOS */}
        {location.pathname === "/facturacion/productos" && (
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Gestión de Productos
          </h2>
        )}

        {location.pathname === "/facturacion/clientes" && (
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Gestión de clientes
          </h2>
        )}

        <Outlet />
      </main>
      {mostrarModal && <ModalFactura onClose={() => setMostrarModal(false)} />}
    </div>
  );
}

export default Layout;
