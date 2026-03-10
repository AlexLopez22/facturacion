import { useEffect, useState } from "react";
import FormularioFactura from "./FormularioFactura";

interface ModalFacturaProps {
    onClose: () => void;
    facturaParaEditar?: any;
}
type Documento = {
    id: number;
    nombre: string;
};




export default function ModalFactura({ onClose, facturaParaEditar }: ModalFacturaProps) {
    const [documentos, setDocumentos] = useState<Documento[]>([]);

    useEffect(() => {
        fetch("http://localhost:8080/documentos/listar-Documentos")
            .then((res) => res.json())
            .then(setDocumentos);
    }, []);
    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

            <div className="bg-white w-full max-w-6xl h-[90vh] rounded-xl shadow-xl relative overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-3 border-b bg-slate-50">
                    <h2 className="font-semibold text-slate-800">
                        {facturaParaEditar ? "Editar comprobante" : "Nuevo comprobante"}
                    </h2>

                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200"
                    >
                        ✕
                    </button>
                </div>

                {/* Body scroll */}
                <div className="p-2 h-full flex flex-col">
                    <FormularioFactura
                        onAfterSave={onClose}
                        facturaParaEditar={facturaParaEditar}
                    />
                </div>

            </div>
        </div>
    );
}