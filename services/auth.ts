import { api } from "./api";
import { AxiosError } from "axios";

interface Loginparms {
  phone: string;
  password: string;
}

interface RegisterParams {
  name: string;
  lastname: string;
  phone: string;
  password: string;
  password_confirmation: string;
  pushToken: string;
}

export async function loginUser(params: Loginparms) {
  try {
    const response = await api.post("/login", params);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const status = error.response?.status;

      if (status === 401) {
        throw new Error("Usuario o contraseña no validos");
      }

      if (status === 403) {
        throw new Error("Este usuario ha sido baneado");
      }

      if (status === 500) {
        throw new Error("Error en el inicio de sesión");
      }

      throw new Error("Error en el inicio de sesión");
    }
  }
}

export async function registerUser(params: RegisterParams) {
  try {
    const response = await api.post("/register", params);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const status = error.response?.status;

      if (status === 409) {
        throw new Error("Este teléfono ha sido registrado");
      }

      if (status === 500) {
        throw new Error("Error en el registro");
      }

      return error;
    }
  }
}
