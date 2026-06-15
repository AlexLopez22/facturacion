import { useEffect, useState } from "react";
import axios from "axios";
import UbigeoSelector from "../componentes/Ubigeo";
import type { Cliente, UbigeoRaw, Departamento, Provincia } from "../types";
import { MagnifyingGlassIcon, CheckCircleIcon } from "@heroicons/react/24/outline";


export default function CrearClienteSunat() {
  const [tipoDoc, setTipoDoc] = useState("6");
  const [numero, setNumero] = useState("");
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [ubigeo, setUbigeo] = useState("");
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filtro, setFiltro] = useState("");
  const token = localStorage.getItem("token");

  // ⚡ Traer ubigeos
  useEffect(() => {
    axios.get<UbigeoRaw[]>("https://springboot-facturacion-backend-production.up.railway.app/ubigeos")
      .then(res => {
        const depMap: Record<string, { codigo: string; nombre: string; provincias: Record<string, Provincia>; }> = {};
        res.data.forEach((u) => {
          if (!depMap[u.departamento]) {
            depMap[u.departamento] = { codigo: u.codigo.substring(0, 2), nombre: u.departamento, provincias: {} };
          }
          if (!depMap[u.departamento].provincias[u.provincia]) {
            depMap[u.departamento].provincias[u.provincia] = {
              codigo: u.codigo.substring(2, 4),
              nombre: u.provincia,
              distritos: []
            };
          }
          depMap[u.departamento].provincias[u.provincia].distritos.push({
            codigo: u.codigo.substring(4, 6),
            nombre: u.distrito
          });
        });
        const deps: Departamento[] = Object.values(depMap).map((d) => ({
          codigo: d.codigo,
          nombre: d.nombre,
          provincias: Object.values(d.provincias)
        }));
        setDepartamentos(deps);
      });
  }, []);

  // ⚡ Traer clientes existentes
  useEffect(() => {
    axios.get<Cliente[]>("https://springboot-facturacion-backend-production.up.railway.app/clients", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setClientes(res.data));
  }, []);

  const consultar = async () => {
    try {
      let res;
      if (tipoDoc === "6") {
        res = await axios.get<Cliente>(
          `https://springboot-facturacion-backend-production.up.railway.app/clients/sunat/${numero}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        res = await axios.get<Cliente>(
          `https://springboot-facturacion-backend-production.up.railway.app/clients/reniec/${numero}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setCliente(res.data);
      if (res.data.ubigeo) setUbigeo(res.data.ubigeo);
      else if (res.data.direccion?.ubigeo) setUbigeo(res.data.direccion.ubigeo);
      else setUbigeo("");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("❌ Error Axios:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
        alert(`Error al consultar cliente: ${error.message}`);
      }
      setCliente(null);
      setUbigeo("");
    }
  };


  const guardar = async () => {
    if (!cliente) return;
    const clienteFinal: Cliente = {
      ...cliente,
      ubigeo: ubigeo || null,
      direccion: { ...cliente.direccion, ubigeo: ubigeo || null }
    };
    await axios.post("https://springboot-facturacion-backend-production.up.railway.app/clients/create-client", clienteFinal, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("Cliente guardado");
    setClientes([...clientes, clienteFinal]);
  };
  const [pagina, setPagina] = useState(1);
  const porPagina = 7;

  const clientesFiltrados = clientes.filter(
    (c) =>
      c.numeroDocumento.toLowerCase().includes(filtro.toLowerCase()) ||
      c.razonSocial.toLowerCase().includes(filtro.toLowerCase())
  );

  const inicio = (pagina - 1) * porPagina;
  const clientesPagina = clientesFiltrados.slice(inicio, inicio + porPagina);
  const totalPaginas = Math.ceil(clientesFiltrados.length / porPagina);

  const buscarClientes = async () => {
    try {
      const res = await axios.get<Cliente[]>(
        "https://springboot-facturacion-backend-production.up.railway.app/clients/list-clients",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setClientes(res.data);
      setPagina(1); // reinicia a la primera página
    } catch (error) {
      console.error("❌ Error al traer clientes:", error);
      alert("No se pudieron cargar los clientes");
    }
  };


  return (
    <div className="pr-6 py-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[505px]">

        <div className="md:col-span-2 bg-white border border-gray-200 rounded-lg shadow p-6 flex flex-col">
          <h3 className="text-lg font-semibold mb-4">Clientes</h3>

          <div className="flex gap-2 mb-4">
            <input
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              placeholder="Buscar por documento o nombre..."
              className="border rounded-lg px-3 py-2 flex-1 focus:ring-blue-300"
            />
            <button
              onClick={buscarClientes} // reinicia a la primera página al buscar
              className="px-4 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-900 transition shadow"
            >
              Buscar
            </button>
            
          </div>

          {/* Tabla con scroll */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-sm text-slate-700 border-collapse">
              <thead className="bg-blue-100/40">
                <tr>
                  <th className="px-4 py-2 border">Documento</th>
                  <th className="px-4 py-2 border">Nombre / Razón Social</th>
                  <th className="px-4 py-2 border">Dirección</th>
                </tr>
              </thead>
              <tbody>
                {clientesPagina.map((c) => (
                  <tr key={c.id} className="border-b hover:bg-blue-50/40 transition">
                    <td className="px-4 py-2">{c.numeroDocumento}</td>
                    <td className="px-4 py-2">{c.razonSocial}</td>
                    <td className="px-4 py-2">{c.direccion?.direccionCompleta || "-"}</td>
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
        {/* Bloque derecha: formulario */}
        <div className="bg-white/60 backdrop-blur-md border border-blue-200/40 rounded-xl shadow-md p-6 space-y-4">
          <h3 className="text-lg font-semibold mb-4">Registrar nuevo cliente</h3>

          <select
            value={tipoDoc}
            onChange={(e) => { setTipoDoc(e.target.value); setCliente(null); setNumero(""); setUbigeo(""); }}
            className="border rounded-lg px-3 py-2 w-full"
          >
            <option value="6">RUC</option>
            <option value="1">DNI</option>
          </select>

          <div className="flex gap-2">
            <input
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              placeholder={tipoDoc === "6" ? "RUC" : "DNI"}
              className="border rounded-lg px-3 py-2 flex-1 focus:ring focus:ring-blue-300"
            />
            <button
              onClick={consultar}
              title="Consultar cliente"
              className="flex items-center justify-center px-4 py-2 rounded-lg 
               bg-gradient-to-r from-blue-200/40 to-blue-300/40 
               text-blue-900 border border-blue-300/40 
               hover:from-blue-300/50 hover:to-blue-400/50 
               transition shadow"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
          </div>

          {cliente && (
            <div className="space-y-4">
              <input
                value={cliente.numeroDocumento || ""}
                onChange={(e) => setCliente({ ...cliente, numeroDocumento: e.target.value })}
                className="border rounded-lg px-3 py-2 w-full"
                placeholder="Documento"
              />
              <input
                value={cliente.razonSocial || ""}
                onChange={(e) => setCliente({ ...cliente, razonSocial: e.target.value })}
                className="border rounded-lg px-3 py-2 w-full"
                placeholder="Nombre / Razón Social"
              />
              <input
                value={cliente.direccion?.direccionCompleta || ""}
                onChange={(e) =>
                  setCliente({
                    ...cliente,
                    direccion: { ...cliente.direccion, direccionCompleta: e.target.value },
                  })
                }
                className="border rounded-lg px-3 py-2 w-full"
                placeholder="Dirección"
              />
              {departamentos.length > 0 && (
                <UbigeoSelector ubigeo={ubigeo} setUbigeo={setUbigeo} departamentos={departamentos} />
              )}
              <div className="flex justify-end">
                <button
                  onClick={guardar}
                  title="Guardar cliente"
                  className="flex items-center justify-center px-6 py-2 rounded-lg 
               bg-gradient-to-r from-green-200/40 to-green-300/40 
               text-green-900 border border-green-300/40 
               hover:from-green-300/50 hover:to-green-400/50 
               transition shadow"
                >
                  <CheckCircleIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

  );
}
