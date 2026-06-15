import { useEffect, useState } from "react";
import FormularioFactura from "./FormularioFactura";
import type { Documento } from "../types";
import { obtenerDocumentos } from "../servicios/documentos";


interface ModalFacturaProps {
    onClose: () => void;
}

export default function ModalFactura({ onClose }: ModalFacturaProps) {
    const [documentos, setDocumentos] = useState<Documento[]>([]);

    useEffect(() => {
        obtenerDocumentos()
            .then((data) => setDocumentos(data))
            .catch((err) => console.error(err));
    }, []);
    
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center animate-fadeIn">

            <div className="bg-white w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl relative overflow-hidden animate-scaleIn">
                {/* Header */}
                <div className="relative flex items-center px-6 py-3 border-b bg-white/50 backdrop-blur-md">

                    {/* Título centrado */}
                    <h2 className="absolute left-1/2 -translate-x-1/2 font-semibold text-slate-800 text-lg">
                        Nuevo comprobante
                    </h2>

                    {/* Botón cerrar a la derecha */}
                    <div className="ml-auto">
                        <button
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center rounded-full 
                                        hover:bg-red-100 hover:text-red-600 transition">
                            ✕
                        </button>
                    </div>

                </div>

                {/* Body scroll */}
                <div className="p-2 h-full flex flex-col">
                    <FormularioFactura
                        onAfterSave={onClose}
                        documentos={documentos}
                    />
                </div>

            </div>
        </div>
    );
}