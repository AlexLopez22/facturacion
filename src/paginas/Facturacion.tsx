import { useState } from "react";
import type { Factura, FiltrosFacturas } from "../types";
import { useUsuarioStore } from "../store/usuarioStore";
import axios from "axios";
import ModalClientes from "../componentes/ModalClientes"
import type { AxiosError } from "axios";

export default function Facturacion() {
    const [facturas, setFacturas] = useState<Factura[]>([]);
    const [pagina, setPagina] = useState(1);

    // filtros
    const hoy = new Date();
    const fechaActual = hoy.toISOString().split("T")[0];
    const [fechaInicio, setFechaInicio] = useState(fechaActual);
    const [fechaFin, setFechaFin] = useState(fechaActual);

    const [tipoDocumento, setTipoDocumento] = useState(""); // FACTURA o BOLETA
    const [serie, setSerie] = useState("");
    const [correlativo, setCorrelativo] = useState("");

    const [clienteId, setClienteId] = useState<number | null>(null);
    const [clienteNombre, setClienteNombre] = useState("");
    const [mostrarModalClientes, setMostrarModalClientes] = useState(false);
    const filasPorPagina = 8;

    const indexInicio = (pagina - 1) * filasPorPagina;
    const indexFin = indexInicio + filasPorPagina;

    const facturasPaginadas = facturas.slice(indexInicio, indexFin);
    const totalPaginas = Math.ceil(facturas.length / filasPorPagina);

    const totalIGV = facturas.reduce((acc, f) => acc + f.igv, 0);
    const totalGeneral = facturas.reduce((acc, f) => acc + f.total, 0);

    const cargarFacturas = async () => {
        const token = useUsuarioStore.getState().token;

        try {
            const params: FiltrosFacturas = {};

            if (fechaInicio) params.fechaInicio = fechaInicio;
            if (fechaFin) params.fechaFin = fechaFin;
            if (tipoDocumento) params.tipoDocumento = tipoDocumento;
            if (serie) params.serie = serie;
            if (correlativo) params.correlativo = correlativo;
            if (clienteId !== null) params.clienteId = clienteId;

            console.log("Parámetros enviados:", params);

            const res = await axios.get<Factura[]>(
                "https://springboot-facturacion-backend-production.up.railway.app/invoices/list-invoices",
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params
                }
            );

            setFacturas(res.data);
            setPagina(1);

        } catch (err) {
            const error = err as AxiosError;
            console.error("ERROR:", error.response?.data);
        }
    };

    return (
        <div className="space-y-4">

            {/* 🔍 FILTROS */}
            <div className="relative bg-white/60 backdrop-blur-md border border-blue-200/40 rounded-xl px-3 pt-4 pb-3 shadow-md">

                {/* Título */}
                <span className="absolute -top-2 left-4 bg-white px-2 text-[14px] text-slate-500">
                    Filtros
                </span>

                {/* Contenedor principal */}
                <div className="flex flex-col md:flex-row md:items-end gap-20">

                    {/* Inputs */}
                    <div className="flex gap-2">
                        {/* Fechas */}
                        <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)}
                            className="w-[119px] h-[35px] text-xs px-2 border rounded" />
                        <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)}
                            className="w-[119px] h-[35px] text-xs px-2 border rounded" />
                    </div>
                    <div className="flex gap-2">
                        {/* Tipo Documento */}
                        <select value={tipoDocumento} onChange={(e) => setTipoDocumento(e.target.value)}
                            className="w-[105px] h-[35px] text-xs px-2 border rounded">
                            <option value="">TODOS</option>
                            <option value="FACTURA">FACTURA</option>
                            <option value="BOLETA">BOLETA</option>
                        </select>

                        {/* Serie */}
                        <input type="text" placeholder="Serie" value={serie} onChange={(e) => setSerie(e.target.value)}
                            className="w-[52px] h-[35px] text-xs px-2 border rounded" />

                        {/* Correlativo */}
                        <input type="text" placeholder="Correlativo" value={correlativo} onChange={(e) => setCorrelativo(e.target.value)}
                            className="w-[86px] h-[35px] text-xs px-2 border rounded" />
                    </div>
                    <div className="flex gap-2 ml-4">
                        {/* Cliente */}
                        <div className="flex gap-2 items-center ">
                            <input
                                type="text"
                                placeholder="Cliente"
                                value={clienteNombre}
                                readOnly
                                className="w-[240px] h-[35px] text-xs px-2 border rounded"
                            />
                            <button type="button" onClick={() => setMostrarModalClientes(true)} className=" px-4 w-[86px] h-[35px]   btn-icon">
                                🔍
                            </button>
                        </div>
                        {mostrarModalClientes && (
                            <ModalClientes
                                onClose={() => setMostrarModalClientes(false)}
                                onSelectCliente={(c) => {
                                    setClienteId(c.id);
                                    setClienteNombre(c.razonSocial);
                                    setMostrarModalClientes(false);
                                }}
                            />
                        )}
                    </div>
                    {/* Botón Buscar */}
                    <div className="flex justify-end">
                        <button
                            onClick={cargarFacturas}
                            className="px-4 h-[32px] text-xs rounded-md bg-slate-800 text-white hover:bg-slate-900 transition shadow"
                        >
                            Buscar
                        </button>
                    </div>

                </div>

            </div>


            {/* 📊 TABLA */}
            <div className="bg-white/60 backdrop-blur-md border border-blue-200/40 rounded-xl shadow-md p-2 h-[380px]">

                <table className="min-w-full text-sm text-slate-700">
                    <thead className="bg-blue-100/40">
                        <tr>
                            <th className="px-1 py-2">N°</th>
                            <th className="px-4 py-2">Fecha</th>
                            <th className="px-4 py-2">Documento</th>
                            <th className="px-4 py-2">Serie</th>
                            <th className="px-4 py-2">Correlativo</th>
                            <th className="px-4 py-2">RUC/DNI</th>
                            <th className="px-4 py-2">Cliente</th>
                            <th className="px-4 py-2">IGV</th>
                            <th className="px-4 py-2">Total</th>
                            <th className="px-4 py-2">Estado</th>
                            <th className="px-4 py-2">PDF</th>
                        </tr>
                    </thead>

                    <tbody>
                        {facturasPaginadas.map((f, i) => (
                            <tr key={f.id} className="border-b hover:bg-blue-50/40 transition">
                                <td className="px-1 py-2">{indexInicio + i + 1}</td>
                                <td className="px-4 py-2">{f.fecha}</td>
                                <td className="px-4 py-2">{f.documento}</td>
                                <td className="px-4 py-2">{f.serie}</td>
                                <td className="px-4 py-2">{f.correlativo}</td>
                                <td className="px-4 py-2">{f.numeroDocumentoCliente}</td>
                                <td className="px-4 py-2">{f.clienteNombre}</td>
                                <td className="px-4 py-2">S/ {f.igv.toFixed(2)}</td>
                                <td className="px-4 py-2 font-semibold">S/ {f.total.toFixed(2)}</td>
                                <td className="px-4 py-2">
                                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                                        {f.estado}
                                    </span>
                                </td>
                                <td className="px-4 py-2">
                                    {f.pdf ? (
                                        <a
                                            href={f.pdf}
                                            target="_blank"
                                            className="text-blue-600 hover:underline"
                                        >
                                            Ver PDF
                                        </a>
                                    ) : (
                                        "-"
                                    )}
                                </td>
                            </tr>
                        ))}
                        <tr className="border-t bg-blue-50/40 font-semibold">
                            <td colSpan={7} className="text-right px-4 py-2">
                                Totales:
                            </td>

                            {/* IGV */}
                            <td className="px-4 py-2 text-right">
                                S/ {totalIGV.toFixed(2)}
                            </td>

                            {/* TOTAL */}
                            <td className="px-4 py-2 text-right">
                                S/ {totalGeneral.toFixed(2)}
                            </td>

                            {/* columnas restantes */}
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            {/* 🔥 FOOTER */}
            <div className="border-t border-blue-200/40 mt-2 pt-2 flex items-center justify-between">

                <div className="flex justify-center items-center gap-4 mt-2">

                    <button
                        onClick={() => setPagina(p => Math.max(p - 1, 1))}
                        className="px-4 py-1.5 text-xs bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Anterior
                    </button>

                    <span className="text-sm text-gray-600">
                        {pagina} / {totalPaginas}
                    </span>

                    <button
                        onClick={() => setPagina(p => Math.min(p + 1, totalPaginas))}
                        className="px-4 py-1.5 text-xs bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    );
}