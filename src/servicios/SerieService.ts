import axios from "axios";
import { useUsuarioStore } from "../store/usuarioStore";

export const validarSerie = async (serie: string) => {

    const token = useUsuarioStore.getState().token;

    const res = await axios.get(
        `http://localhost:8080/serie/validar/${serie}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );

    return res.data;
};