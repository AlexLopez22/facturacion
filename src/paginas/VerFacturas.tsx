import { useEffect, useState } from "react";
import { obtenerFacturas, eliminarFactura } from "../servicios/facturas";
import { generarPDF } from "../utils/pdfFactura";
import ModalFactura from "../componentes/ModalFactura";

interface Factura {
  id: number;
  ruc: string;
  razonSocial: string;
  total: number;
  igv: number;
  fecha: string;
}

function VerFacturas() {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);

  const cargarFacturas = async () => {
    const datos = await obtenerFacturas();
    setFacturas(datos);
  };

  const eliminar = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar esta factura?")) return;
    await eliminarFactura(id);
    cargarFacturas();
  };

  useEffect(() => {
    cargarFacturas();
  }, []);

  const [facturaAEditar, setFacturaAEditar] = useState<any>(null);

  return (
    <div className="relative">
      <h2 className="text-xl font-semibold mb-4">Facturas Emitidas</h2>

      {facturas.length === 0 ? (
        <p>No hay facturas registradas.</p>
      ) : (
        <table className="w-full border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Cliente</th>
              <th className="p-2 border">RUC</th>
              <th className="p-2 border">IGV</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Fecha</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {facturas.map((factura) => (
              <tr key={factura.id}>
                <td className="p-2 border text-center">{factura.id}</td>
                <td className="p-2 border">{factura.razonSocial}</td>
                <td className="p-2 border">{factura.ruc}</td>
                <td className="p-2 border">S/ {factura.igv.toFixed(2)}</td>
                <td className="p-2 border font-semibold">
                  S/ {factura.total.toFixed(2)}
                </td>
                <td className="p-2 border">
                  {new Date(factura.fecha).toLocaleDateString()}
                </td>
                <td className="p-2 border text-center space-x-2">
                  <button
                    onClick={() => eliminar(factura.id)}
                    className="text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                  <button
                    onClick={() => {
                      setFacturaAEditar(factura);
                      setMostrarModal(true);
                    }}
                    className="text-yellow-600 hover:underline"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => generarPDF(factura)}
                    className="text-blue-600 hover:underline"
                  >
                    PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Botón para abrir el modal */}
      <button
        onClick={() => setMostrarModal(true)}
        className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow-lg hover:bg-green-700"
      >
        Nuevo Comprobante
      </button>

      {mostrarModal && (
        <ModalFactura
          onClose={() => {
            setMostrarModal(false);
            setFacturaAEditar(null);
            cargarFacturas();
          }}
          facturaParaEditar={facturaAEditar}
        />
      )}
    </div>
  );
}

export default VerFacturas;
