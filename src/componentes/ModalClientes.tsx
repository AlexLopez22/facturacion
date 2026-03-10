import { useEffect, useState } from "react";
import axios from "axios";
import { useUsuarioStore } from "../store/usuarioStore";

interface Cliente {
  id: number;
  numeroDocumento: string;
  razonSocial: string;
  direccion?: {
    direccionCompleta: string;
  } | null;
}
interface Props {
  onClose: () => void;
  onSelectCliente: (cliente: Cliente) => void;
}

export default function ModalClientes({ onClose, onSelectCliente }: Props) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const token = useUsuarioStore.getState().token; 
    axios.get("http://localhost:8080/clients/list-clients", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        console.log("Clientes cargados:", res.data); 
        setClientes(res.data);
      })
      .catch(err => console.error("Error cargando clientes:", err));
  }, []);


  const clientesFiltrados = clientes.filter(c =>
    c.razonSocial.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.numeroDocumento.includes(busqueda)
  );


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded w-96">
        <h2 className="text-lg font-semibold mb-2">Seleccionar Cliente</h2>
        <input
          type="text"
          placeholder="Buscar cliente..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <div className="max-h-60 overflow-y-auto">
          {clientesFiltrados.map(c => (
            <div
              key={c.id}
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => onSelectCliente(c)}
            >
              {c.numeroDocumento} - {c.razonSocial}
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-3 bg-red-500 text-white px-3 py-1 rounded"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
