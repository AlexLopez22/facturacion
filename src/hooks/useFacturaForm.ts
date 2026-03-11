import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { facturaSchema } from "../validation/facturaSchema";
import type { FacturaForm } from "../types";
import type { Resolver } from "react-hook-form";

export const useFacturaForm = () => {

    return useForm<FacturaForm>({
        resolver: yupResolver(facturaSchema) as unknown as Resolver<FacturaForm>,
        mode: "onSubmit",
        defaultValues: {
            tipo_comprobante_id: 0,
            clienteId: 0,
            clienteNombre: "",
            clienteDireccion: "",
            serieId: 0,
            numero: "",
            moneda: "PEN",
            fechaEmision: new Date().toISOString().split("T")[0],
            horaEmision: new Date().toTimeString().slice(0, 5),
            formaPagoId: 0,
            items: [],
            tipoOperacion: "01",
        },
    });

};