import { useEffect, useState } from "react";
import axios from "axios";
import type { Producto } from "../types";

interface Props {
    onClose: () => void;
    onSelectProductos: (productos: Producto[]) => void; // 👈 plural
    token: string | null;
}

export default function ModalProductos({ onClose, onSelectProductos, token }: Props) {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [busqueda, setBusqueda] = useState("");
    const [seleccionados, setSeleccionados] = useState<Producto[]>([]);

    useEffect(() => {
        if (!token) {
            console.error("No hay token disponible");
            return;
        }

        axios.get("http://localhost:8080/products/list-product", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                console.log("Productos cargados:", res.data);
                setProductos(res.data);
            })
            .catch(err => console.error("Error cargando productos:", err));
    }, [token]);

    const toggleSeleccion = (producto: Producto) => {
        if (seleccionados.some(p => p.id === producto.id)) {
            setSeleccionados(seleccionados.filter(p => p.id !== producto.id));
        } else {
            setSeleccionados([...seleccionados, producto]);
        }
    };

    const productosFiltrados = productos.filter(p =>
        (p.descripcion ?? "").toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded w-96">
                <h2 className="text-lg font-semibold mb-2">Seleccionar Producto</h2>
                <input
                    type="text"
                    placeholder="Buscar producto..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="border p-2 rounded w-full mb-2"
                />
                <div className="max-h-60 overflow-y-auto">
                    {productosFiltrados.map(p => (
                        <div
                            key={p.id}
                            className={`p-2 cursor-pointer ${seleccionados.some(sel => sel.id === p.id)
                                ? "bg-blue-200"
                                : "hover:bg-gray-200"
                                }`}
                            onClick={() => toggleSeleccion(p)}
                        >
                            {p.descripcion || "Sin descripción"} - ({p.unidadMedida})
                        </div>
                    ))}
                </div>
                <button
                    onClick={() => {
                        if (seleccionados.length > 0) {
                            onSelectProductos(seleccionados);
                        }
                        onClose();
                    }}
                    className="mt-3 bg-green-500 text-white px-3 py-1 rounded"
                >
                    Insertar al detalle
                </button>

                <button
                    onClick={onClose}
                    className="mt-3 ml-2 bg-red-500 text-white px-3 py-1 rounded"
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
}
