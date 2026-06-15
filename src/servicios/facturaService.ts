import axios from "axios";

export const obtenerClientes = () =>
  axios.get("https://springboot-facturacion-backend-production.up.railway.app/clients/list-clients");

export const obtenerProductos = () =>
  axios.get("https://springboot-facturacion-backend-production.up.railway.app/products/list-products");

export const obtenerFormasPago = (token: string) =>
  axios.get("https://springboot-facturacion-backend-production.up.railway.app/formas-pago/listar", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const obtenerSeriePredeterminada = (tipoComprobanteId: number, token: string) =>
  axios.get(`https://springboot-facturacion-backend-production.up.railway.app/serie/predeterminada/${tipoComprobanteId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const validarSerie = (serie: string, token: string) =>
  axios.get(`https://springboot-facturacion-backend-production.up.railway.app/serie/validar/${serie}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const crearFactura = (factura: unknown, token: string) =>
  axios.post(
    "https://springboot-facturacion-backend-production.up.railway.app/invoices/create-invoices",
    factura,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );