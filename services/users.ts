import { api } from "./api";
import { AxiosError } from "axios";
import { Role } from "../types/User";

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

export async function updateRole(userid: string, role: Role) {
  try {
    const response = await api.put(`/users/${userid}/role`, { role });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const status = error.response?.status;

      if (status === 404) {
        throw new Error("Usuario no encontrado");
      }

      if (status === 500) {
        throw new Error("Error en la base de datos");
      }

      return error;
    }

    throw error;
  }
}
