import type {  Documento } from "../types";

export async function obtenerDocumentos(): Promise<Documento[]> {
  const res = await fetch("https://springboot-facturacion-backend-production.up.railway.app/documentos/listar-Documentos", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) throw new Error("Error al obtener documentos");
  return res.json();
}