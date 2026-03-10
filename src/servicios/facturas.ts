// servicios/facturas.ts
import axios from "axios";

const API_URL = "http://localhost:8080/invoices";

/**
 * Guarda una nueva factura en el backend
 * @param factura Datos de la factura en formato JSON
 */
export async function guardarFactura(factura: any) {
  try {
    const response = await axios.post(`${API_URL}/create-invoices`, factura, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error al guardar la factura:", error);
    throw error;
  }
}

/**
 * Obtiene la lista de facturas registradas
 */
export async function listarFacturas() {
  try {
    const response = await axios.get(`${API_URL}/list-invoices`);
    return response.data;
  } catch (error: any) {
    console.error("Error al listar facturas:", error);
    throw error;
  }
}

/**
 * Actualiza una factura existente
 * @param id ID de la factura
 * @param factura Datos actualizados
 */
export async function actualizarFactura(id: number, factura: any) {
  try {
    const response = await axios.put(`${API_URL}/update-invoices/${id}`, factura, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error al actualizar la factura:", error);
    throw error;
  }
}

/**
 * Elimina una factura por ID
 * @param id ID de la factura
 */
export async function eliminarFactura(id: number) {
  try {
    const response = await axios.delete(`${API_URL}/delete-invoices/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Error al eliminar la factura:", error);
    throw error;
  }
}
