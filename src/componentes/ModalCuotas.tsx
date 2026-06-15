import { useState } from "react";

import type { Cuota, Props } from "../types";


export default function ModalCuotas({ onClose, onSave, total }: Props) {

    const [cuotas, setCuotas] = useState<Cuota[]>([
        { numeroCuota: 1, fechaVencimiento: "", importe: 0 }
    ]);

    const agregarCuota = () => {
        setCuotas(prev => [
            ...prev,
            {
                numeroCuota: prev.length + 1,
                fechaVencimiento: "",
                importe: 0
            }
        ]);
    };

    const eliminarCuota = (index: number) => {
        const nuevas = cuotas.filter((_, i) => i !== index)
            .map((c, i) => ({ ...c, numeroCuota: i + 1 }));
        setCuotas(nuevas);
    };

    const actualizarCuota = (index: number, campo: keyof Cuota, valor: string | number) => {
        const nuevas = [...cuotas];
        nuevas[index] = {
            ...nuevas[index],
            [campo]: campo === "importe" ? Number(valor) : valor
        };
        setCuotas(nuevas);
    };

    const guardar = () => {
        const suma = cuotas.reduce((acc, c) => acc + c.importe, 0);

        if (suma !== total) {
            alert("❌ La suma de cuotas debe ser igual al total");
            return;
        }

        onSave(cuotas);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl shadow-lg w-[500px] p-4 space-y-4">

                <h2 className="text-lg font-bold text-slate-800">
                    Cuotas (Crédito)
                </h2>

                {/* TABLA */}
                <div className="space-y-2 max-h-[300px] overflow-y-auto">

                    {cuotas.map((c, i) => (
                        <div key={i} className="flex gap-2 items-center">

                            <span className="w-6 text-sm">{c.numeroCuota}</span>

                            <input
                                type="date"
                                value={c.fechaVencimiento}
                                onChange={(e) => actualizarCuota(i, "fechaVencimiento", e.target.value)}
                                className="input flex-1"
                            />

                            <input
                                type="number"
                                value={c.importe}
                                onChange={(e) => actualizarCuota(i, "importe", e.target.value)}
                                className="input w-28 text-right"
                            />

                            <button
                                type="button"
                                onClick={() => eliminarCuota(i)}
                                className="text-red-500"
                            >
                                ✕
                            </button>

                        </div>
                    ))}

                </div>

                {/* BOTONES */}
                <div className="flex justify-between items-center">

                    <button
                        type="button"
                        onClick={agregarCuota}
                        className="text-sm text-blue-600"
                    >
                        + Agregar cuota
                    </button>

                    <div className="flex gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-1 bg-gray-200 rounded"
                        >
                            Cancelar
                        </button>

                        <button
                            onClick={guardar}
                            className="px-4 py-1 bg-slate-800 text-white rounded"
                        >
                            Guardar
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}