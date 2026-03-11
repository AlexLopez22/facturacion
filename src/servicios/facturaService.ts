import axios from "axios";

export const obtenerClientes = () =>
  axios.get("http://localhost:8080/clients/list-clients");

export const obtenerProductos = () =>
  axios.get("http://localhost:8080/products/list-products");

export const obtenerFormasPago = (token: string) =>
  axios.get("http://localhost:8080/formas-pago/listar", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const obtenerSeriePredeterminada = (tipoComprobanteId: number, token: string) =>
  axios.get(`http://localhost:8080/serie/predeterminada/${tipoComprobanteId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const validarSerie = (serie: string, token: string) =>
  axios.get(`http://localhost:8080/serie/validar/${serie}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const crearFactura = (factura: unknown, token: string) =>
  axios.post(
    "http://localhost:8080/invoices/create-invoices",
    factura,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );