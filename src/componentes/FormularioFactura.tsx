import { useEffect, useState } from "react";
import axios from "axios";
import ModalClientes from "./ModalClientes";
import { obtenerDocumentos } from "../servicios/documentos";
import type { Documento } from "../servicios/documentos";
import { Controller } from "react-hook-form";
import { useUsuarioStore } from "../store/usuarioStore";
import ModalProductos from "./ModalProductos";
import type { Producto, Cliente, FormaPago, FacturaForm } from "../types";
import type { FieldError } from "react-hook-form"
import { useFacturaTotales } from "../hooks/useFacturaTotales";
import { useFacturaForm } from "../hooks/useFacturaForm";
import { useFieldArray } from "react-hook-form";
import { validarSerie } from "../servicios/SerieService";

interface Props {
    onAfterSave?: () => void;
    facturaParaEditar?: Record<string, unknown>;
}

export default function FormularioFactura({ onAfterSave, facturaParaEditar }: Props) {

    const [formasPago, setFormasPago] = useState<FormaPago[]>([]);
    const [documentos, setDocumentos] = useState<Documento[]>([]);
    const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
    const [mostrarModalClientes, setMostrarModalClientes] = useState(false);
    const [mostrarModalProductos, setMostrarModalProductos] = useState(false);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [filaSeleccionada, setFilaSeleccionada] = useState<number | null>(null);

    const handleSelectProductos = (productos: Producto[]) => {
        if (productos.length === 1 && filaSeleccionada !== null) {
            const producto = productos[0];
            setValue(`items.${filaSeleccionada}.productoId`, producto.id);
            setValue(`items.${filaSeleccionada}.codigo`, producto.codigo);
            setValue(`items.${filaSeleccionada}.descripcion`, producto.descripcion);
            setValue(`items.${filaSeleccionada}.unidadMedida`, producto.unidadMedida);
            setValue(`items.${filaSeleccionada}.afectacionIgv`, producto.afectacionIgv);
            setValue(`items.${filaSeleccionada}.precioUnitario`, 0);
            setValue(`items.${filaSeleccionada}.cantidad`, 1);
        } else {
            productos.forEach(prod => {
                append({
                    productoId: prod.id,
                    codigo: prod.codigo,
                    descripcion: prod.descripcion,
                    unidadMedida: prod.unidadMedida,
                    afectacionIgv: prod.afectacionIgv,
                    precioUnitario: 0,
                    cantidad: 1,
                });
            });
        }

        const itemsActuales = watch("items") || [];
        const itemsFiltrados = itemsActuales.filter(
            (f) => f.productoId && f.descripcion && f.descripcion.trim() !== ""
        );
        setValue("items", itemsFiltrados);
        setMostrarModalProductos(false);
        setFilaSeleccionada(null);
    };
    const abrirModalClientes = () => {
        setMostrarModalClientes(true);
    };
    const toggleRow = (index: number) => {
        setSelectedRows(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };
    const eliminarSeleccionados = () => {
        selectedRows
            .sort((a, b) => b - a)
            .forEach(i => remove(i));

        setSelectedRows([]);
    };
    const abrirModalProductos = (index: number) => {
        setFilaSeleccionada(index);
        setMostrarModalProductos(true);
    };
    const abrirModalCuotas = () => {
        alert("Aquí se abrirá el modal de cuotas");
    };
    const { register, control, handleSubmit, watch, reset, setValue, formState: { errors }, } = useFacturaForm();
    const items = watch("items") || [];
    const { subtotalCalc, igvCalc, totalCalc, igvRate } = useFacturaTotales(items);
    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    });

    const handleSelectCliente = (cliente: Cliente) => {
        setValue("clienteId", cliente.id, { shouldValidate: true });
        setValue("clienteNombre", cliente.razonSocial, { shouldValidate: true });
        setValue("clienteDireccion", cliente.direccion ? cliente.direccion.direccionCompleta : "",
            { shouldValidate: true }
        );
        setClienteSeleccionado(cliente); // opcional si quieres guardar el cliente en estado
        setMostrarModalClientes(false);  // cerrar el modal
    };
    useEffect(() => {
        obtenerDocumentos()
            .then(docs => {
                console.log("Documentos cargados:", docs);
                setDocumentos(docs);
            })
            .catch(err => console.error(err));
    }, []);
    const tipoComprobanteId = watch("tipo_comprobante_id");

    useEffect(() => {

        if (!tipoComprobanteId || facturaParaEditar) return;

        const id = Number(tipoComprobanteId);
        const token = useUsuarioStore.getState().token;

        axios.get(`http://localhost:8080/serie/predeterminada/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {

                if (res.data) {

                    setValue("serieId", Number(res.data.id), { shouldValidate: true });

                    setValue("serieNombre", res.data.nombreSerie, { shouldValidate: true });

                    setValue("numero", res.data.numeroPredeterminado.toString(), { shouldValidate: true });

                }

            })
            .catch(err => console.error("ERROR:", err));

    }, [tipoComprobanteId, facturaParaEditar]);

    useEffect(() => {
        const token = useUsuarioStore.getState().token;
        axios.get("http://localhost:8080/formas-pago/listar", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => setFormasPago(res.data))
            .catch(err => console.error("Error cargando formas de pago:", err));
    }, []);
    useEffect(() => {
        if (facturaParaEditar) {
            reset(facturaParaEditar);
        }
    }, [facturaParaEditar, reset]);

    const construirFacturaPayload = (
        data: FacturaForm,
        subtotalCalc: number,
        igvCalc: number,
        totalCalc: number,
        igvRate: number
    ) => {

        return {
            tipoDocumento: data.tipo_comprobante_id,
            serie: data.serieId,
            numero: data.numero,
            moneda: data.moneda,
            tipoOperacion: data.tipoOperacion,
            fechaEmision: data.fechaEmision,
            horaEmision: data.horaEmision,
            clienteId: data.clienteId,
            emisorId: 1,
            formaPagoId: data.formaPagoId,
            totales: {
                opGravada: subtotalCalc,
                opExonerada: 0,
                opInafecta: 0,
                opGratuita: 0,
                igv: igvCalc,
                totalImpuestos: igvCalc,
                importeTotal: totalCalc,
            },
            items: data.items.map((item, index) => {
                const totalItem = item.cantidad * item.precioUnitario;
                const valorVentaItem = totalItem / (1 + igvRate);

                return {
                    item: index + 1,
                    productoId: item.productoId,
                    codigoProducto: item.codigo,
                    descripcion: item.descripcion,
                    cantidad: item.cantidad,
                    unidadMedida: item.unidadMedida,
                    valorUnitario: valorVentaItem,
                    precioUnitario: item.precioUnitario,
                    valorVenta: valorVentaItem,
                    afectacionIgv: item.afectacionIgv,
                    importeTotal: totalItem,
                };
            }),
            cuotas: [],
        };
    };
    const onSubmit = async (data: FacturaForm) => {
        if (!data.serieId || data.serieId === 0) {
            alert("Debe seleccionar una serie válida");
            return;
        }
        const facturaAEnviar = construirFacturaPayload(
            data,
            subtotalCalc,
            igvCalc,
            totalCalc,
            igvRate
        );
        try {
            const token = useUsuarioStore.getState().token;

            await axios.post(
                "http://localhost:8080/invoices/create-invoices",
                facturaAEnviar,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            alert("✅ Factura guardada correctamente");

            if (onAfterSave) onAfterSave();

        } catch (error) {
            console.error("Error:", error);
            alert("❌ Error al guardar");
        }
    };
    return (
        <div className="w-full">

            <form onSubmit={handleSubmit(onSubmit)}
                className="p-4 space-y-3 text-sm flex flex-col h-full overflow-hidden" >
                <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-2">
                    {/* FILA 1 */}
                    <div className="flex items-end gap-2  border-slate-200 rounded-lg  bg-slate-50">
                        {/* Tipo comprobante */}
                        <div className="w-40">
                            <label className="label">Tipo comprobante</label>
                            <select {...register("tipo_comprobante_id")} className="input">
                                <option value="">Seleccionar</option>
                                {documentos.map((doc) => (
                                    <option key={doc.id} value={doc.id}>
                                        {doc.nombre}
                                    </option>
                                ))}
                            </select>
                            {errors.tipo_comprobante_id && (
                                <p className="text-red-500 text-xs">{errors.tipo_comprobante_id.message}</p>
                            )}

                        </div>
                        {/* Serie */}
                        <div className="w-16">
                            <label className="label">Serie</label>
                            <Controller
                                name="serieNombre"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        maxLength={4}
                                        className="input text-center"

                                        onChange={async (e) => {
                                            field.onChange(e); // mantiene sincronizado React Hook Form

                                            const valor = e.target.value;

                                            if (valor.length === 4) {
                                                try {

                                                    const data = await validarSerie(valor);

                                                    if (!data.existe) {

                                                        alert("La serie ingresada no existe. Corrija antes de continuar.");
                                                        setValue("serieId", 0, { shouldValidate: true });

                                                    } else {

                                                        const idSerie = Number(data.id);
                                                        setValue("serieId", isNaN(idSerie) ? 0 : idSerie, { shouldValidate: true });

                                                    }

                                                } catch (err) {

                                                    console.error("Error al validar la serie:", err);
                                                    alert("Error al validar la serie");

                                                }
                                            }
                                        }}

                                        onBlur={() => {
                                            field.onBlur(); // importante para React Hook Form
                                        }}

                                    />
                                )}
                            />
                        </div>
                        {/* Correlativo */}
                        <div className="w-24">
                            <label className="label">Correlativo</label>
                            <input {...register("numero")} className="input text-right" />
                        </div>
                        {/* Condición pago */}
                        <div className="w-40">
                            <label className="label">Condición pago</label>
                            <div className="flex gap-1">
                                <select {...register("formaPagoId")} className="input flex-1">
                                    <option value="">Seleccionar</option>
                                    {formasPago.map(fp => (
                                        <option key={fp.id} value={fp.id}>
                                            {fp.tipo}
                                        </option>
                                    ))}
                                </select>
                                <button type="button" onClick={abrirModalCuotas} className="btn-icon">
                                    ➕
                                </button>
                            </div>
                        </div>
                        {/* Fecha */}
                        <div className="w-36">
                            <label className="label">Fecha emisión</label>
                            <input type="date" {...register("fechaEmision")} className="input" />
                        </div>
                        {/* Moneda */}
                        <div className="w-24">
                            <label className="label">Moneda</label>
                            <select {...register("moneda")} className="input">
                                <option value="PEN">SOLES</option>
                                <option value="USD">DOLARES</option>
                            </select>
                        </div>
                        <div className="w-64">
                            <label className="label">Tipo operación</label>
                            <select {...register("tipoOperacion")} className="input">
                                <option value="01">VENTA INTERNA - GRAVADA</option>
                            </select>
                        </div>
                        {/* IGV al final */}
                        <div className="w-14 ml-auto">
                            <label className="label">IGV</label>
                            <input value={`${igvRate}`} readOnly className="input bg-slate-100 text-center" />
                        </div>
                    </div>
                    {/* FILA 2 */}
                    <div className="flex gap-2 mt-2">
                        <div className="w-80">
                            <label className="label">Cliente</label>
                            <div className="flex gap-1">
                                <input {...register("clienteNombre")} className="input flex-1" readOnly />
                                <button type="button" onClick={abrirModalClientes} className="btn-icon">
                                    🔍
                                </button>
                            </div>
                            {errors.clienteId && <p className="text-red-500">Cliente es obligatorio</p>}
                        </div>
                        <div className="flex-1">
                            <label className="label">Dirección</label>
                            <input {...register("clienteDireccion")} className="input" readOnly />
                        </div>
                    </div>
                </div>
                {/* DETALLE */}
                <div className="border border-slate-200 rounded-lg flex flex-col flex-1">
                    <div className="px-4 py-2 bg-slate-50 font-medium text-slate-700">
                        Detalle de productos
                    </div>
                    {/* CABECERA */}
                    <div className="grid grid-cols-12 text-xs font-medium text-slate-600">
                        <div className="col-span-1"></div>
                        <div className="col-span-3">Producto</div>
                        <div className="col-span-1 text-right">Cant</div>
                        <div className="col-span-1 text-right">Precio</div>
                        <div className="col-span-1 text-center">Und</div>
                        <div className="col-span-2 text-right">Valor Venta</div>
                        <div className="col-span-2 text-right">IGV</div>
                        <div className="col-span-1 text-right">Total</div>
                    </div>
                    {/* FILAS */}
                    <div className="h-36 overflow-y-auto divide-y">
                        {fields.map((item, index) => {
                            const cant = watch(`items.${index}.cantidad`) || 0;
                            const precio = watch(`items.${index}.precioUnitario`) || 0; // precio incluye IGV
                            const totalItem = cant * precio;
                            const valorVenta = totalItem / 1.18;
                            const igvItem = totalItem - valorVenta;
                            return (
                                <div key={item.id} className="grid grid-cols-12 gap-2 px-1 py-1 items-center text-sm">
                                    {/* check */}
                                    <div className="col-span-1 flex justify-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedRows.includes(index)}
                                            onChange={() => toggleRow(index)}
                                        />
                                    </div>
                                    {/* producto */}
                                    <div className="col-span-3 flex gap-1">
                                        <input readOnly value={watch(`items.${index}.descripcion`) || ""} className="input-detalle flex-1" />
                                        <button type="button" onClick={() => abrirModalProductos(index)} className="btn-icon" >    🔍  </button>
                                    </div>
                                    {/* cantidad */}
                                    <input type="number"     {...register(`items.${index}.cantidad`)} className="input-detalle text-right col-span-1" />
                                    {/* precio */}
                                    <input type="number" step="0.01"  {...register(`items.${index}.precioUnitario`)} className="input-detalle text-right col-span-1" />
                                    {/* unidad */}
                                    <input  {...register(`items.${index}.unidadMedida`)} className="input-detalle text-center col-span-1" />
                                    {/* valor venta */}
                                    <div className="col-span-2 text-right text-slate-700">  {valorVenta.toFixed(2)}
                                    </div>
                                    {/* igv */}
                                    <div className="col-span-2 text-right text-slate-700"> {igvItem.toFixed(2)}
                                    </div>
                                    {/* total */}
                                    <div className="col-span-1 text-right font-semibold text-slate-800">{totalItem.toFixed(2)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {errors.items && (<p className="text-red-500 text-xs">Debe agregar al menos un producto</p>)}
                    {/* FOOT DETALLE */}
                    <div className="flex justify-between items-center px-4 py-2 bg-slate-50">
                        <button type="button" onClick={eliminarSeleccionados} className="text-red-600 text-sm font-medium hover:underline"  >
                            Eliminar detalle
                        </button>
                        <button type="button" onClick={() => append({
                            productoId: 0,
                            codigo: "",
                            descripcion: "",
                            unidadMedida: "NIU",
                            afectacionIgv: "10",
                            cantidad: 1,
                            precioUnitario: 0,
                        })} className="btn-secondary">
                            + Agregar producto
                        </button>
                    </div>
                </div>
                {/* FOOTER */}
                <div className="flex items-center justify-between pt-2 border-t">
                    {/* Botón izquierda */}
                    <button type="submit" className="btn-primary">
                        {facturaParaEditar ? "Actualizar" : "Guardar comprobante"}
                    </button>
                    {/* Mostrar errores globales */}
                    {Object.keys(errors).length > 0 && (
                        <div className="text-red-600 text-sm">
                            <p>⚠️ Hay errores en el formulario:</p>
                            <ul>
                                {Object.entries(errors).map(([key, value]) => {
                                    const err = value as FieldError;
                                    return <li key={key}>{String(err?.message)}</li>;
                                })}
                            </ul>
                        </div>
                    )}
                    {/* Totales derecha */}
                    <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1">
                            <span className="text-slate-500">VALOR VENTA</span>
                            <span className="font-medium">  S/ {subtotalCalc.toFixed(2)}   </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-slate-500">IGV</span>
                            <span className="font-medium"> S/ {igvCalc.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-base font-semibold text-slate-800">
                            <span>TOTAL</span>
                            <span>S/ {totalCalc.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                {mostrarModalClientes && (
                    <ModalClientes onClose={() => setMostrarModalClientes(false)} onSelectCliente={handleSelectCliente} />
                )}
                {mostrarModalProductos && (<ModalProductos onClose={() => setMostrarModalProductos(false)}
                    onSelectProductos={handleSelectProductos}
                    token={useUsuarioStore.getState().token} />
                )}
                {clienteSeleccionado && (
                    <div className="text-sm text-gray-600">
                        Cliente seleccionado: {clienteSeleccionado.razonSocial}
                    </div>
                )}
            </form >
        </div >
    );
}
