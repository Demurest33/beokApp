import { api } from "./api";
import { AxiosError } from "axios";

export async function getMenu() {
  try {
    const response = await api.get("/menu");
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return error;
    }
  }
}

export async function getProductOptions(id: number) {
  try {
    const response = await api.get(`/product/${id}/options`);
    return response.data.options;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        throw new Error("Producto no encontrado");
      }

      return error;
    }
  }
}
