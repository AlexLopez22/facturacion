import * as yup from "yup";

export const facturaSchema = yup.object({
    tipo_comprobante_id: yup.number().min(1, "Debe seleccionar documento"),
    clienteId: yup.number().min(1, "Debe seleccionar cliente"),
    serieId: yup.number().required("Serie es obligatoria").typeError("Serie es obligatoria"),
    serieNombre: yup.string().required("Serie nombre es obligatoria"),
    numero: yup.string().required("Número es obligatorio"),
    moneda: yup.string().required("Moneda es obligatoria"),
    fechaEmision: yup.string().required("Fecha es obligatoria"),
    horaEmision: yup.string().required("Hora es obligatoria"),
    formaPagoId: yup.number().min(1, "Debe seleccionar forma de pago"),
    items: yup.array().of(
        yup.object({
            productoId: yup.number().required("Producto obligatorio"),
            cantidad: yup.number().required("Cantidad obligatoria"),
            precioUnitario: yup.number().required("Precio obligatorio"),
            unidadMedida: yup.string().required("Unidad obligatoria"),
            descripcion: yup.string().nullable(),
            codigo: yup.string().nullable(),
            afectacionIgv: yup.string().nullable(),
        })
    ).min(1, "Debe agregar al menos un producto"),
    clienteNombre: yup.string().nullable(),
    clienteDireccion: yup.string().nullable(),
    tipoOperacion: yup.string().required(),
});