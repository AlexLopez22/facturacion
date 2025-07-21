import FormularioFactura from "./FormularioFactura";

interface ModalFacturaProps {
  onClose: () => void;
}
interface ModalFacturaProps {
    onClose: () => void;
    facturaParaEditar?: any;
  }
  export default function ModalFactura({ onClose, facturaParaEditar }: ModalFacturaProps) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
        <div className="bg-white w-full max-w-2xl rounded-lg shadow p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-red-600 text-lg"
          >
            ✕
          </button>
          <h2 className="text-xl font-semibold mb-4">
            {facturaParaEditar ? "Editar Comprobante" : "Nuevo Comprobante"}
          </h2>
          <FormularioFactura
            onAfterSave={onClose}
            facturaParaEditar={facturaParaEditar}
          />
        </div>
      </div>
    );
  }