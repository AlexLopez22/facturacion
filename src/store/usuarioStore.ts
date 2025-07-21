import { create } from "zustand";

interface Usuario {
  nombre: string;
  empresa: string;
}

interface UsuarioState {
  usuario: Usuario | null;
  login: (u: Usuario) => void;
  logout: () => void;
}

export const useUsuarioStore = create<UsuarioState>((set) => ({
  usuario: null,
  login: (usuario) => set({ usuario }),
  logout: () => set({ usuario: null }),
}));
