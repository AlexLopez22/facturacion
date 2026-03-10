import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

type Documento = {
  id: number;
  tipoComprobante: string;
  nombre: string;
};

type SerieBD = {
  id: number;
  nombreSerie: string;
  idDocumentos: number;
  predeterminada?: boolean;
};

type SerieForm = {
  idDocumento: string;
  serie: string;
  predeterminada: boolean;
};

function SeriesConfig() {
  const { register, handleSubmit, reset } = useForm<SerieForm>({
    defaultValues: {
      idDocumento: "",
      serie: "",
    },
  });

  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [series, setSeries] = useState<SerieBD[]>([]);

  // 🔹 cargar documentos
  useEffect(() => {
    fetch("http://localhost:8080/documentos/listar-Documentos", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then(setDocumentos);
  }, []);

  // 🔹 cargar series desde BD
  useEffect(() => {
    fetch("http://localhost:8080/serie/listar", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("SERIES BACKEND:", data); 
        setSeries(data);
      });
  }, []);

  const onSubmit = async (data: SerieForm) => {
    const idDoc = Number(data.idDocumento);

    if (data.predeterminada && yaExistePredeterminada(idDoc)) {
    alert("Ya existe una serie predeterminada para este documento. Se reemplazará.");
  }
  
    const res = await fetch("http://localhost:8080/serie/crear", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        nombreSerie: data.serie,
        idDocumentos: Number(data.idDocumento),
        predeterminada: data.predeterminada || false,
      }),
    });

    const nueva = await res.json();

    setSeries((prev) => [...prev, nueva]);
    reset();
  };

  const nombreDocumento = (id: number) => {
    const doc = documentos.find((d) => d.id === id);
    return doc?.nombre || "";
  };

  const yaExistePredeterminada = (idDocumento: number) => {
  return series.some(
    (s) => s.idDocumentos === idDocumento && s.predeterminada === true
  );
};

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-bold mb-4">Series de comprobante</h2>

      {/* Formulario */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4 items-end mb-6">
        <div>
          <label className="label">Tipo comprobante</label>
          <select {...register("idDocumento", { required: true })} className="input">
            <option value="">Seleccionar</option>
            {documentos.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Serie</label>
          <input
            {...register("serie", { required: true })}
            className="input w-32"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register("predeterminada")}
          />
          <label>Serie predeterminada</label>
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Agregar Serie
        </button>
      </form>

      {/* Tabla */}
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Tipo</th>
            <th className="p-2 border">Serie</th>
            <th className="p-2 border">Predeterminada</th>

          </tr>
        </thead>
        <tbody>
          {series.map((s: any) => (
            <tr key={s.id}>
              <td className="p-2 border">
                {nombreDocumento(s.idDocumentos ?? s.id_documentos)}
              </td>
              <td className="p-2 border">
                {s.nombreSerie ?? s.nombre_serie}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SeriesConfig;