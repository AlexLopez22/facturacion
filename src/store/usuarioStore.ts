import { create } from "zustand";

interface UsuarioState {
  usuario: Usuario | null;
  token: string | null;
  login: (usuario: Usuario, token: string) => void;
  logout: () => void;
}
interface Usuario {
  correo: string;
  rol: string;
  tenantDb: string;
}


export const useUsuarioStore = create<UsuarioState>((set) => {
  // Al iniciar, intenta cargar token desde localStorage
  const token = localStorage.getItem("token");// Si hay token, decodifícalo para obtener info del usuario
  let usuario: Usuario | null = null;

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      usuario = {
        correo: payload.sub,
        rol: payload.rol,
        tenantDb: payload.tenantDb,
      };
    } catch (e) {
      console.error("Error decodificando token", e);// Si el token es inválido, limpiamos localStorage
    }
  }

  return {
    usuario,
    token,
    login: (usuario, token) => {
      localStorage.setItem("token", token);// Guarda el token en localStorage
      set({ usuario, token });
    },
    logout: () => {
      localStorage.removeItem("token");// Limpia el token de localStorage
      set({ usuario: null, token: null });
    },
  };
});
