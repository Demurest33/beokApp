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

export async function getAdminMenu() {
  try {
    const response = await api.get("/products-by-category");
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return error;
    }
  }
}

export async function toogleProductAvailability(id: number) {
  try {
    const response = await api.patch(`/products/${id}/toggle-availability`);

    if (response.status === 200) {
      return true;
    }
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return error;
    }
  }
}
