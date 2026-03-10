import { useEffect, useState } from "react";
import { crearProducto, obtenerProductos, eliminarProducto } from "../servicios/productos";

const unidadesMedida = [
  { codigo: "NIU", nombre: "Unidad" },
  { codigo: "KG", nombre: "Kilogramo" },
  { codigo: "G", nombre: "Gramo" },
  { codigo: "M", nombre: "Metro" },
  { codigo: "LTR", nombre: "Litro" },
  { codigo: "MTK", nombre: "Metro cuadrado" },
  { codigo: "MTR", nombre: "Metro lineal" },
  { codigo: "HUR", nombre: "Hora" },
  { codigo: "DAY", nombre: "Día" },
  { codigo: "MMK", nombre: "Milímetro cuadrado" },
];

function Productos() {
  const [productos, setProductos] = useState<any[]>([]);
  const [codigo, setCodigo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [unidadMedida, setUnidadMedida] = useState("");
  const [showModal, setShowModal] = useState(false); // 👈 estado para modal

  useEffect(() => {
    obtenerProductos().then(setProductos);
  }, []);

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!unidadMedida) {
      alert("Debe seleccionar una unidad de medida");
      return;
    }

    try {
      const nuevo = await crearProducto({
        codigo,
        descripcion,
        unidadMedida,
        afectacionIgv: "10",
        estado: "ACTIVO",
      });
      setProductos([...productos, nuevo]);
      setCodigo("");
      setDescripcion("");
      setUnidadMedida("");
      setShowModal(true); // 👈 mostrar modal de confirmación
    } catch (error: any) {
      alert(`Error al crear producto: ${error.message}`);
    }
  };

  const handleEliminar = async (id: number) => {
    await eliminarProducto(id);
    setProductos(productos.filter((p) => p.id !== id));
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Gestión de Productos</h2>
      <form onSubmit={handleCrear} className="mb-4 flex gap-2">
        <input
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="Código"
          className="border px-2 py-1"
        />
        <input
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripción"
          className="border px-2 py-1"
        />
        <select
          value={unidadMedida}
          onChange={(e) => setUnidadMedida(e.target.value)}
          className="border px-2 py-1"
        >
          <option value="">Seleccionar</option>
          {unidadesMedida.map((u) => (
            <option key={u.codigo} value={u.codigo}>
              {u.nombre}
            </option>
          ))}
        </select>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Crear
        </button>
      </form>

      {/* Modal flotante */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <p className="text-lg font-semibold mb-4">✅ Producto creado correctamente</p>
            <button
              onClick={() => setShowModal(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}

      <ul>
        {productos.map((p) => (
          <li key={p.id} className="flex justify-between items-center mb-2">
            <span>{p.codigo} - {p.descripcion} ({p.unidadMedida})</span>
            <button
              onClick={() => handleEliminar(p.id)}
              className="bg-red-600 text-white px-2 py-1 rounded"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Productos;
