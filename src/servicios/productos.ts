import { fetchWithAuth } from "../utils/fetchWithAuth";

export const crearProducto = async (producto: any) => {
  const response = await fetchWithAuth("http://localhost:8080/products/create-product", {
    method: "POST",
    body: JSON.stringify(producto),
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: No autorizado o fallo en la petición`);
  }

  return response.json();
};

export const obtenerProductos = async () => {
  const response = await fetchWithAuth("http://localhost:8080/products/list-product", {
    method: "GET",
  });
  return response.json();
};

export const eliminarProducto = async (id: number) => {
  const response = await fetchWithAuth(`http://localhost:8080/products/list-product/${id}`, {
    method: "DELETE",
  });
  return response.json();
};
