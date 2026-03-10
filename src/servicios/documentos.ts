export interface Documento {
  id: number;
  tipoComprobante: string;
  nombre: string;
}

export async function obtenerDocumentos(): Promise<Documento[]> {
  const res = await fetch("http://localhost:8080/documentos/listar-Documentos", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) throw new Error("Error al obtener documentos");
  return res.json();
}