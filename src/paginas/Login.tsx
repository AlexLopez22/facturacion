import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUsuarioStore } from "../store/usuarioStore";

function Login() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const navigate = useNavigate();
  const login = useUsuarioStore((state) => state.login);
  const token = useUsuarioStore((state) => state.token);
const [loading, setLoading] = useState(false);

  // 👇 Si ya hay token o está en localStorage, redirige al facturación
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (token || storedToken) {
      navigate("/facturacion", { replace: true });
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("https://springboot-facturacion-backend-production.up.railway.app/auth/login", {
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
    }finally {
    setLoading(false); // desactiva loading
  }
  };
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-200 overflow-hidden">

      <img
        src="../../imagenes/imagen2-login.png"
        alt="fondo"
        className="absolute left-10 top-1/2 -translate-y-1/2 w-[450px] opacity-70 blur-md"
      />

      {/* Bloque externo translúcido */}
      <div className="flex items-center justify-between bg-white/10 backdrop-blur-lg rounded-3xl shadow-xl p-10 w-[1150px]">

        {/* Columna izquierda */}
        <div className="w-1/2 flex flex-col items-center">
          {/* Bloque interno translúcido (vidrio real) */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl shadow-md p-8 w-full max-w-xs  min-h-[450px]
                animate-fadeIn">

            <h2 className="text-3xl font-bold mb-6 text-blue-700 text-center">
              Login
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Campo correo */}
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Correo electrónico</label>
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  placeholder="correo@gmail.com"
                  className="w-full bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 
             text-gray-800 placeholder-gray-500 font-normal text-base
             focus:outline-none focus:ring-2 focus:ring-blue-400 border border-white/30"
                />
              </div>

              {/* Campo contraseña */}
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Contraseña</label>
                <input
                  type="password"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  placeholder="********"
                  className="w-full bg-white/40 backdrop-blur-sm rounded-lg px-4 py-2 
           focus:outline-none focus:ring-2 focus:ring-blue-400 focus:scale-105 transition duration-300"

                />
              </div>

              <div className="text-right text-sm">
                <a href="#" className="text-blue-600 hover:underline hover:text-blue-800 transition duration-200">
                  ¿Olvidaste tu contraseña?
                </a>

              </div>

              <button
                type="submit"
                className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition relative"
              >
                {loading ? "Cargando..." : "Ingresar"}
              </button>


            </form>

            {/*
            <div className="mt-6 text-center text-sm text-gray-700">
             
              <div className="flex justify-center gap-4 mt-2">
                <button className="bg-white/70 p-2 rounded-full shadow">Icono 1</button>
                <button className="bg-white/70 p-2 rounded-full shadow">Icono 2</button>
                <button className="bg-white/70 p-2 rounded-full shadow">Icono 3</button>
              </div>
            </div>
            <div className="mt-6 text-center text-sm">
             <a href="#" className="text-blue-600 font-semibold">Registro</a>
            </div>*/}
          </div>
        </div>

        {/* Columna derecha - Imagen */}
        <div className="w-1/2 flex justify-center">
          <img
            src="../../imagenes/imagen1-login.png"
            alt="Login"
            className="w-80 transition-transform duration-500 hover:scale-105 hover:rotate-1"

          />
        </div>
      </div>
    </div>
  );



}

export default Login;
