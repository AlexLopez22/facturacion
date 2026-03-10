import { Navigate } from "react-router-dom";
import { useUsuarioStore } from "../store/usuarioStore";
import type { JSX } from "react/jsx-dev-runtime";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = useUsuarioStore((state) => state.token);
  return token ? children : <Navigate to="/" />;
}

export default PrivateRoute;
