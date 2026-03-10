import { useEffect, useState } from "react";

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

interface Props {
  ubigeo: string;
  setUbigeo: (valor: string) => void;
  departamentos: Departamento[];
}

export default function UbigeoSelector({ ubigeo, setUbigeo, departamentos }: Props) {
  const [depCod, setDepCod] = useState("");
  const [provCod, setProvCod] = useState("");
  const [distCod, setDistCod] = useState("");
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [distritos, setDistritos] = useState<Distrito[]>([]);

  // ⚡ Autocompletar selects según ubigeo
  useEffect(() => {
    if (!ubigeo || departamentos.length === 0) return;

    const dep = ubigeo.substring(0, 2);
    const prov = ubigeo.substring(2, 4);
    const dist = ubigeo.substring(4, 6);

    const depObj = departamentos.find(d => d.codigo === dep);
    if (!depObj) return;

    const provObj = depObj.provincias.find(p => p.codigo === prov);
    if (!provObj) return;

    setDepCod(dep);
    setProvincias(depObj.provincias);
    setProvCod(prov);
    setDistritos(provObj.distritos);
    setDistCod(dist);
  }, [ubigeo, departamentos]);

  const seleccionarDepartamento = (codigo: string) => {
    setDepCod(codigo);
    setProvCod("");
    setDistCod("");
    setUbigeo("");

    const dep = departamentos.find(d => d.codigo === codigo);
    setProvincias(dep ? dep.provincias : []);
    setDistritos([]);
  };

  const seleccionarProvincia = (codigo: string) => {
    setProvCod(codigo);
    setDistCod("");
    setUbigeo("");

    const prov = provincias.find(p => p.codigo === codigo);
    setDistritos(prov ? prov.distritos : []);
  };

  const seleccionarDistrito = (codigo: string) => {
    setDistCod(codigo);
    setUbigeo(depCod + provCod + codigo);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      <select value={depCod} onChange={e => seleccionarDepartamento(e.target.value)} className="border p-2 rounded">
        <option value="">Departamento</option>
        {departamentos.map(d => <option key={d.codigo} value={d.codigo}>{d.nombre}</option>)}
      </select>

      <select value={provCod} onChange={e => seleccionarProvincia(e.target.value)} disabled={!depCod} className="border p-2 rounded">
        <option value="">Provincia</option>
        {provincias.map(p => <option key={p.codigo} value={p.codigo}>{p.nombre}</option>)}
      </select>

      <select value={distCod} onChange={e => seleccionarDistrito(e.target.value)} disabled={!provCod} className="border p-2 rounded">
        <option value="">Distrito</option>
        {distritos.map(d => <option key={d.codigo} value={d.codigo}>{d.nombre}</option>)}
      </select>
    </div>
  );
}