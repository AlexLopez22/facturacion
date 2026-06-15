import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { facturaSchema } from "../validation/facturaSchema";
import type { FacturaForm } from "../types";
import type { Resolver } from "react-hook-form";

export const useFacturaForm = () => {
     const hoy = new Date();
  const año = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const dia = String(hoy.getDate()).padStart(2, "0");
  const fechaLocalISO = `${año}-${mes}-${dia}`; // siempre YYYY-MM-DD en local

  const horaLocal = hoy.toTimeString().slice(0, 5); // HH:mm
    
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
            fechaEmision: fechaLocalISO,
            horaEmision: horaLocal,
            formaPagoId: 0,
            items: [],
            tipoOperacion: "0101",
        },
    });

};