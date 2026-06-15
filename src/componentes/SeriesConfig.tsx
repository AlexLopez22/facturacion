import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import type { Documento, SerieBD, SerieForm } from "../types";

function SeriesConfig() {
  const { register, handleSubmit, reset } = useForm<SerieForm>({
    defaultValues: { idDocumento: "", serie: "", predeterminada: false },
  });

  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [series, setSeries] = useState<SerieBD[]>([]);

  // cargar documentos
  useEffect(() => {
    fetch("https://springboot-facturacion-backend-production.up.railway.app/documentos/listar-Documentos", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then(setDocumentos);
  }, []);

  // cargar series
  useEffect(() => {
    fetch("https://springboot-facturacion-backend-production.up.railway.app/serie/listar", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then(setSeries);
  }, []);

  const yaExistePredeterminada = (idDocumento: number) =>
    series.some((s) => s.idDocumentos === idDocumento && s.predeterminada);

  const onSubmit = async (data: SerieForm) => {
    const idDoc = Number(data.idDocumento);
    if (data.predeterminada && yaExistePredeterminada(idDoc)) {
      alert("Ya existe una serie predeterminada para este documento. Se reemplazará.");
    }

    const res = await fetch("https://springboot-facturacion-backend-production.up.railway.app/serie/crear", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        nombreSerie: data.serie,
        idDocumentos: idDoc,
        predeterminada: data.predeterminada || false,
      }),
    });

    const nueva = await res.json();
    setSeries((prev) => [...prev, nueva]);
    reset();
  };

  const nombreDocumento = (id: number) =>
    documentos.find((d) => d.id === id)?.nombre || "";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Bloque izquierda: listado */}
      <div className="bg-white/60 backdrop-blur-md border border-blue-200/40 rounded-xl shadow-md p-6">
        <h2 className="text-lg font-bold mb-4">Series registradas</h2>
        <table className="w-full text-sm text-slate-700 border-collapse">
          <thead className="bg-blue-100/40">
            <tr>
              <th className="p-2 border">Tipo</th>
              <th className="p-2 border">Serie</th>
              <th className="p-2 border">Predeterminada</th>
            </tr>
          </thead>
          <tbody>
            {series.map((s) => (
              <tr key={s.id} className="border-b hover:bg-blue-50/40 transition">
                <td className="p-2 border">{nombreDocumento(s.idDocumentos)}</td>
                <td className="p-2 border">{s.nombreSerie}</td>
                <td className="p-2 border text-center">
                  {s.predeterminada ? (
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                      Sí
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bloque derecha: formulario */}
      <div className="bg-white/60 backdrop-blur-md border border-blue-200/40 rounded-xl shadow-md p-6">
        <h2 className="text-lg font-bold mb-4">Registrar nueva serie</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-semibold">Tipo comprobante</label>
            <select {...register("idDocumento", { required: true })} className="border rounded-lg px-3 py-2 w-full">
              <option value="">Seleccionar</option>
              {documentos.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold">Serie</label>
            <input {...register("serie", { required: true })} className="border rounded-lg px-3 py-2 w-full" />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" {...register("predeterminada")} />
            <label>Serie predeterminada</label>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-900 transition shadow"
            >
              Agregar Serie
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SeriesConfig;
