import axios from "axios";
import { useUsuarioStore } from "../store/usuarioStore";

export const listarFormasPago = async () => {
  const token = useUsuarioStore.getState().token;

  const res = await axios.get(
    "https://springboot-facturacion-backend-production.up.railway.app/formas-pago/listar",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};