import axios from "axios";
import { useUsuarioStore } from "../store/usuarioStore";

export const validarSerie = async (serie: string) => {

    const token = useUsuarioStore.getState().token;

    const res = await axios.get(
        `https://springboot-facturacion-backend-production.up.railway.app/serie/validar/${serie}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );

    return res.data;
};