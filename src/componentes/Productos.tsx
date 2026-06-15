import { useEffect, useState } from "react";
import { crearProducto, obtenerProductos, eliminarProducto } from "../servicios/productos";
import type { Producto } from "../types";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

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
  const [productos, setProductos] = useState<Producto[]>([]);
  const [codigo, setCodigo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [unidadMedida, setUnidadMedida] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [filtro, setFiltro] = useState("");
  const [pagina, setPagina] = useState(1);
  const porPagina = 7;

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
      setShowModal(true);
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(`Error al crear producto: ${error.message}`);
      } else {
        alert("Error desconocido al crear producto");
      }
    }
  };

  const handleEliminar = async (id: number) => {
    await eliminarProducto(id);
    setProductos(productos.filter((p) => p.id !== id));
  };

  const handleEditar = (producto: Producto) => {
    console.log("Editar producto:", producto);
    // Aquí puedes abrir un modal o formulario de edición
  };

  const productosFiltrados = productos.filter(
    (p) =>
      p.codigo.toLowerCase().includes(filtro.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(filtro.toLowerCase())
  );

  const inicio = (pagina - 1) * porPagina;
  const productosPagina = productosFiltrados.slice(inicio, inicio + porPagina);
  const totalPaginas = Math.ceil(productosFiltrados.length / porPagina);

  return (
    <div className=" pr-6 py-4">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[505px]">

        <div className="md:col-span-2 bg-white border border-gray-200 rounded-lg shadow p-6 flex flex-col">
          <h3 className="text-lg font-semibold mb-4">Productos</h3>

          <input
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            placeholder="Buscar por código o descripción..."
            className="border rounded-lg px-3 py-2 mb-4 w-full focus:ring focus:ring-blue-300"
          />
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-sm text-slate-700 border-collapse">
              <thead className="bg-blue-100/40">
                <tr>
                  <th className="px-4 py-2 border">Código</th>
                  <th className="px-4 py-2 border">Descripción</th>
                  <th className="px-4 py-2 border">Unidad</th>
                  <th className="px-4 py-2 border text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosPagina.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-blue-50/40 transition">
                    <td className="px-4 py-2">{p.codigo}</td>
                    <td className="px-4 py-2">{p.descripcion}</td>
                    <td className="px-4 py-2">{p.unidadMedida}</td>
                    <td className="px-4 py-2 flex justify-center gap-3">
                      <button
                        onClick={() => handleEditar(p)}
                        className="text-blue-600 hover:text-blue-800 transition"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEliminar(p.id)}
                        className="text-red-600 hover:text-red-800 transition"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Paginación */}
          <div className="flex justify-between items-center mt-4">
            <button
              disabled={pagina === 1}
              onClick={() => setPagina((p) => Math.max(p - 1, 1))}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-600">
              Página {pagina} de {totalPaginas}
            </span>
            <button
              disabled={pagina === totalPaginas}
              onClick={() => setPagina((p) => Math.min(p + 1, totalPaginas))}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>

        {/* Bloque derecha: formulario ocupa 1 columna */}
        <div className="bg-white border border-gray-200 rounded-lg shadow p-6 flex flex-col">
          <h3 className="text-lg font-semibold mb-4">Registrar nuevo producto</h3>

          <form onSubmit={handleCrear} className="space-y-4">
            <input
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Código"
              className="border rounded-lg px-3 py-2 w-full focus:ring focus:ring-blue-300"
            />
            <input
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción"
              className="border rounded-lg px-3 py-2 w-full focus:ring focus:ring-blue-300"
            />
            <select
              value={unidadMedida}
              onChange={(e) => setUnidadMedida(e.target.value)}
              className="border rounded-lg px-3 py-2 w-full focus:ring focus:ring-blue-300"
            >
              <option value="">Seleccionar unidad</option>
              {unidadesMedida.map((u) => (
                <option key={u.codigo} value={u.codigo}>
                  {u.nombre}
                </option>
              ))}
            </select>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-900 transition shadow"
              >
                Crear producto
              </button>
            </div>
          </form>
        </div>
      </div>


      {/* Modal de confirmación */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <p className="text-lg font-semibold mb-4">✅ Producto creado correctamente</p>
            <button
              onClick={() => setShowModal(false)}
              className="px-6 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-900 transition shadow"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Productos;
