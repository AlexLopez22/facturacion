import { useUsuarioStore } from "../store/usuarioStore";
import { Link, Outlet, useNavigate } from "react-router-dom";

function Layout() {
  const usuario = useUsuarioStore((state) => state.usuario);
  const logout = useUsuarioStore((state) => state.logout);
  const navigate = useNavigate();

  if (!usuario) {
    navigate("/");
    return null;
  }

  return (
    <div>
      <div className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center">
        <div>
          <p className="font-bold">{usuario.empresa}</p>
          <p className="text-sm">Usuario: {usuario.nombre}</p>
        </div>
        <div className="space-x-4">
          <Link to="/facturacion" className="hover:underline">Facturación</Link>
          <button onClick={logout} className="hover:underline text-red-200">
            Cerrar sesión
          </button>
        </div>
      </div>
      <div className="p-4">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
