import axios from "axios";

const API_URL = "http://localhost:4000/facturas";

export const guardarFactura = async (factura: any) => {
  const response = await axios.post(API_URL, factura);
  return response.data;
};

export const obtenerFacturas = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const eliminarFactura = async (id: number) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
