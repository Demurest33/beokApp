import { api } from "./api";
import { AxiosError } from "axios";
import { Role } from "../types/User";

export async function getAllUsers(userid?: string) {
  try {
    // Construye la URL con o sin el parámetro userId
    const url = userid ? `/users?userId=${userid}` : "/users";
    const response = await api.get(url);

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

      throw new Error("Error desconocido al obtener los usuarios");
    }

    throw new Error("Error desconocido al obtener los usuarios");
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

export async function toogleBanUser(userid: string) {
  try {
    const response = await api.patch(`/users/${userid}/toggle-ban`);

    if (response.status === 200) {
      return response.data;
    }
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
