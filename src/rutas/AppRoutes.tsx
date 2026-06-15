import { Routes, Route } from "react-router-dom";
import Login from "../paginas/Login";
import Productos from "../componentes/Productos";
import Layout from "../componentes/Layout";
import CrearClienteSunat from "../componentes/CrearClienteSunat";
import PrivateRoute from "./PrivateRoute";
import Configuracion from "../paginas/Configuracion";
import Facturacion from "../paginas/Facturacion";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/facturacion"element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Facturacion />} />
        <Route path="productos" element={<Productos />} />
        <Route path="clientes" element={<CrearClienteSunat />} />
        <Route path="configuracion" element={<Configuracion />} />
      </Route>
    </Routes>
  );
}
