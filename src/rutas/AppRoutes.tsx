import { Routes, Route } from "react-router-dom";
import Login from "../paginas/Login";
import VerFacturas from "../paginas/VerFacturas";
import NuevaFactura from "../paginas/NuevaFactura";
import Layout from "../componentes/Layout";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/facturacion" element={<Layout />}>
        <Route index element={<VerFacturas />} />
        <Route path="nueva" element={<NuevaFactura />} />
      </Route>
    </Routes>
  );
}
