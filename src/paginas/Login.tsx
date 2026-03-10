import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUsuarioStore } from "../store/usuarioStore";

function Login() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const navigate = useNavigate();
  const login = useUsuarioStore((state) => state.login);
  const token = useUsuarioStore((state) => state.token);

  // 👇 Si ya hay token o está en localStorage, redirige al facturación
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (token || storedToken) {
      navigate("/facturacion", { replace: true });
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contrasena }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);

        // Decodificar el JWT para extraer rol y tenantDb
        const payload = JSON.parse(atob(data.token.split(".")[1]));
        const usuario = {
          correo: payload.sub,
          rol: payload.rol,
          tenantDb: payload.tenantDb,
        };

        login(usuario, data.token);
        navigate("/facturacion", { replace: true }); // 👈 replace evita volver atrás
      } else {
        alert("Credenciales inválidas");
      }
    } catch (error) {
      console.error("Error en login:", error);
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-80">
        <h2 className="text-xl font-semibold mb-4 text-center">Ingreso al Sistema</h2>
        <input
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          placeholder="Correo electrónico"
          className="input mb-2"
        />
        <input
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          placeholder="Contraseña"
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
