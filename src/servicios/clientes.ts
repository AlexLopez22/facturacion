import axios from "axios";

const API_URL = "http://localhost:8080/clients";

export const consultarSunat = async (ruc: string) => {
  const res = await axios.get(`${API_URL}/sunat/${ruc}`);
  return res.data;
};

export const consultarReniec = async (dni: string) => {
  const res = await axios.get(`${API_URL}/reniec/${dni}`);
  return res.data;
};

export const guardarCliente = async (cliente: any, token: string) => {
  const payload = {
    ...cliente,
    ubigeo: cliente.ubigeo || null, // ⚡ siempre incluir
    estado: cliente.estado || "ACTIVO",
    condicion: cliente.condicion || "HABIDO",
  };

  const res = await axios.post(`${API_URL}/create-client`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};