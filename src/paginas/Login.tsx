import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUsuarioStore } from "../store/usuarioStore";

function Login() {
  const [empresa, setEmpresa] = useState("");
  const [usuario, setUsuario] = useState("");
  const navigate = useNavigate();
  const login = useUsuarioStore((state) => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ empresa, nombre: usuario });
    navigate("/facturacion");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-80">
        <h2 className="text-xl font-semibold mb-4 text-center">Ingreso al Sistema</h2>
        <input
          type="text"
          value={empresa}
          onChange={(e) => setEmpresa(e.target.value)}
          placeholder="Nombre de empresa"
          className="input mb-2"
        />
        <input
          type="text"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          placeholder="Nombre de usuario"
          className="input mb-4"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Ingresar
        </button>
      </form>
    </div>
  );
}

export default Login;
