import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { guardarFactura } from "../servicios/facturas";

interface Props {
  onAfterSave?: () => void;
  facturaParaEditar?: any; // puedes tiparlo mejor si gustas
}

const schema = yup.object().shape({
  ruc: yup.string().required("El RUC es obligatorio"),
  razonSocial: yup.string().required("La razón social es obligatoria"),
  items: yup
    .array()
    .of(
      yup.object().shape({
        descripcion: yup.string().required("Requerido"),
        cantidad: yup.number().positive().required("Requerido"),
        precioUnitario: yup.number().positive().required("Requerido"),
      })
    )
    .min(1, "Debe haber al menos un producto"),
});

type FacturaForm = yup.InferType<typeof schema>;

export default function FormularioFactura({ onAfterSave, facturaParaEditar }: Props) {
  const [igv, setIgv] = useState(0);
  const [total, setTotal] = useState(0);

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FacturaForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      ruc: "",
      razonSocial: "",
      items: [{ descripcion: "", cantidad: 1, precioUnitario: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items");

  useEffect(() => {
    if (facturaParaEditar) {
      reset({
        ruc: facturaParaEditar.ruc,
        razonSocial: facturaParaEditar.razonSocial,
        items: facturaParaEditar.items,
      });
      const subtotal = facturaParaEditar.items.reduce(
        (acc: number, item: any) => acc + item.cantidad * item.precioUnitario,
        0
      );
      setIgv(subtotal * 0.18);
      setTotal(subtotal * 1.18);
    }
  }, [facturaParaEditar, reset]);

  const calcularTotales = () => {
    const subtotal = items.reduce(
      (acc, item) => acc + item.cantidad * item.precioUnitario,
      0
    );
    const nuevoIgv = subtotal * 0.18;
    const nuevoTotal = subtotal + nuevoIgv;
    setIgv(nuevoIgv);
    setTotal(nuevoTotal);
  };

  const onSubmit = async (data: FacturaForm) => {
    calcularTotales();
    const facturaAEnviar = {
      ...data,
      igv: parseFloat((data.items.reduce((acc, i) => acc + i.cantidad * i.precioUnitario, 0) * 0.18).toFixed(2)),
      total: parseFloat((data.items.reduce((acc, i) => acc + i.cantidad * i.precioUnitario, 0) * 1.18).toFixed(2)),
      fecha: new Date().toISOString(),
    };

    try {
      if (facturaParaEditar?.id) {
        await fetch(`http://localhost:4000/facturas/${facturaParaEditar.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(facturaAEnviar),
        });
        alert("✅ Factura actualizada correctamente");
      } else {
        await guardarFactura(facturaAEnviar);
        alert("✅ Factura guardada correctamente");
      }

      if (onAfterSave) onAfterSave(); // cerrar modal
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Error al guardar");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>RUC del Cliente</label>
          <input
            {...register("ruc")}
            className="input"
            placeholder="RUC"
          />
          <p className="text-red-500 text-sm">{errors.ruc?.message}</p>
        </div>
        <div>
          <label>Razón Social</label>
          <input
            {...register("razonSocial")}
            className="input"
            placeholder="Razón Social"
          />
          <p className="text-red-500 text-sm">{errors.razonSocial?.message}</p>
        </div>
      </div>

      <h3 className="text-lg font-semibold">Detalle de Productos</h3>
      {fields.map((item, index) => (
        <div key={item.id} className="grid grid-cols-4 gap-2 items-end">
          <div>
            <input
              {...register(`items.${index}.descripcion`)}
              className="input"
              placeholder="Descripción"
            />
            <p className="text-red-500 text-sm">
              {errors.items?.[index]?.descripcion?.message}
            </p>
          </div>
          <div>
            <input
              type="number"
              step="1"
              {...register(`items.${index}.cantidad`)}
              className="input"
              placeholder="Cantidad"
            />
            <p className="text-red-500 text-sm">
              {errors.items?.[index]?.cantidad?.message}
            </p>
          </div>
          <div>
            <input
              type="number"
              step="0.01"
              {...register(`items.${index}.precioUnitario`)}
              className="input"
              placeholder="Precio Unitario"
            />
            <p className="text-red-500 text-sm">
              {errors.items?.[index]?.precioUnitario?.message}
            </p>
          </div>
          <button
            type="button"
            onClick={() => remove(index)}
            className="text-red-500 underline"
          >
            Eliminar
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          append({ descripcion: "", cantidad: 1, precioUnitario: 0 })
        }
        className="bg-blue-500 text-white px-3 py-1 rounded"
      >
        + Agregar Producto
      </button>

      <div className="mt-4 space-y-1">
        <p>IGV (18%): S/ {igv.toFixed(2)}</p>
        <p>Total: <strong>S/ {total.toFixed(2)}</strong></p>
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        {facturaParaEditar ? "Actualizar Factura" : "Registrar Factura"}
      </button>
    </form>
  );
}
