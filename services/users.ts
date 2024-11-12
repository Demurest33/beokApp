import { api } from "./api";
import { AxiosError } from "axios";

export async function getAllUsers() {
  try {
    const response = await api.get("/users");
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const status = error.response?.status;

      if (status === 404) {
        throw new Error("No se encontraron usuarios");
      }

      if (status === 500) {
        throw new Error("Error en la base de datos");
      }

      return error;
    }

    throw error;
  }
}
