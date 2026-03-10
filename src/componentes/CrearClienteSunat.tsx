import { useEffect, useState } from "react";
import axios from "axios";
import UbigeoSelector from "../componentes/Ubigeo";
import type { Cliente } from "../types";

interface Distrito {
  codigo: string;
  nombre: string;
}

interface Provincia {
  codigo: string;
  nombre: string;
  distritos: Distrito[];
}

interface Departamento {
  codigo: string;
  nombre: string;
  provincias: Provincia[];
}

interface UbigeoRaw {
  codigo: string;
  departamento: string;
  provincia: string;
  distrito: string;
}

export default function CrearClienteSunat() {
  const [tipoDoc, setTipoDoc] = useState("6");
  const [numero, setNumero] = useState("");
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [ubigeo, setUbigeo] = useState(""); // Código de ubigeo seleccionado
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const token = localStorage.getItem("token");

  // ⚡ Traer ubigeos desde la BD y convertirlos en jerarquía
  useEffect(() => {
    axios.get<UbigeoRaw[]>("http://localhost:8080/ubigeos").then(res => {
      const depMap: Record<string, {
        codigo: string;
        nombre: string;
        provincias: Record<string, Provincia>;
      }> = {};

      res.data.forEach((u) => {
        if (!depMap[u.departamento]) {
          depMap[u.departamento] = {
            codigo: u.codigo.substring(0, 2),
            nombre: u.departamento,
            provincias: {}
          };
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

  const consultar = async () => {
    try {
      let res;
      if (tipoDoc === "6") {
        res = await axios.get<Cliente>(`http://localhost:8080/clients/sunat/${numero}`);
      } else {
        res = await axios.get<Cliente>(`http://localhost:8080/clients/reniec/${numero}`);
      }

      setCliente(res.data);

      // ⚡ Si llega ubigeo del RUC o RENIEC, autocompletar selects
      if (res.data.ubigeo) {
        setUbigeo(res.data.ubigeo);
      } else if (res.data.direccion?.ubigeo) {
        setUbigeo(res.data.direccion.ubigeo);
      } else {
        setUbigeo("");
      }
    } catch {
      alert("No se encontró el documento");
      setCliente(null);
      setUbigeo("");
    }
  };

  const guardar = async () => {
    if (!cliente) return;

    const clienteFinal: Cliente = {
      ...cliente,
      ubigeo: ubigeo || null,
      direccion: {
        ...cliente.direccion,
        ubigeo: ubigeo || null
      }
    };

    await axios.post("http://localhost:8080/clients/create-client", clienteFinal, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("Cliente guardado");
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow">
      <h2 className="text-xl font-bold mb-4">Crear Cliente</h2>

      <select
        value={tipoDoc}
        onChange={(e) => { setTipoDoc(e.target.value); setCliente(null); setNumero(""); setUbigeo(""); }}
        className="border p-2 rounded w-full mb-3"
      >
        <option value="6">RUC</option>
        <option value="1">DNI</option>
      </select>

      <div className="flex gap-2 mb-4">
        <input
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          placeholder={tipoDoc === "6" ? "RUC" : "DNI"}
          className="border p-2 rounded w-full"
        />
        <button onClick={consultar} className="bg-blue-600 text-white px-4 rounded">Consultar</button>
      </div>

      {cliente && (
        <div className="border rounded p-4 space-y-2">
          <div>
            <label className="text-sm">Documento</label>
            <input
              value={cliente.numeroDocumento || ""}
              onChange={(e) =>
                setCliente({ ...cliente, numeroDocumento: e.target.value })
              }
              className="border p-2 rounded w-full"
              placeholder="Ingrese documento"
            />
          </div>

          <div>
            <label className="text-sm">Nombre / Razón Social</label>
            <input
              value={cliente.razonSocial || ""}
              onChange={(e) =>
                setCliente({ ...cliente, razonSocial: e.target.value })
              }
              className="border p-2 rounded w-full"
              placeholder="Ingrese nombre o razón social"
            />
          </div>
          <div>
            <label className="text-sm">Dirección</label>
            <input
              value={cliente.direccion?.direccionCompleta || ""}
              onChange={(e) => setCliente({ ...cliente, direccion: { ...cliente.direccion, direccionCompleta: e.target.value } })}
              className="border p-2 rounded w-full"
              placeholder="Ingrese dirección"
            />
          </div>

          {/* ⚡ Ubigeo Selector */}
          {departamentos.length > 0 && (
            <UbigeoSelector ubigeo={ubigeo} setUbigeo={setUbigeo} departamentos={departamentos} />
          )}

          <button onClick={guardar} className="mt-3 bg-green-600 text-white px-4 py-2 rounded">Guardar Cliente</button>
        </div>
      )}
    </div>
  );
}
