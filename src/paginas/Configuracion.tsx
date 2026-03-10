import { useState } from "react";
import SeriesConfig from "../componentes/SeriesConfig";  

function Configuracion() {
  const [opcion, setOpcion] = useState<"series" | null>(null);

  return (
    <div className="flex gap-6">
      {/* Menú lateral */}
      <div className="w-60 border rounded-lg p-4 bg-white shadow">
        <h2 className="font-bold mb-4">Configuración</h2>

        <button
          onClick={() => setOpcion("series")}
          className={`block w-full text-left px-3 py-2 rounded hover:bg-blue-50 ${
            opcion === "series" ? "bg-blue-100 font-semibold" : ""
          }`}
        >
          Series de comprobante
        </button>
      </div>

      {/* Contenido */}
      <div className="flex-1">
        {opcion === "series" && <SeriesConfig />}
        {!opcion && (
          <div className="text-gray-500">
            Seleccione una opción de configuración
          </div>
        )}
      </div>
    </div>
  );
}

export default Configuracion;