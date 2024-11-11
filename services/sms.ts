import { api } from "./api";
import { AxiosError } from "axios";

interface SmsResponse {
  message: string;
  verification_code: Number;
}

interface VerifySmsResponse {
  phone: string;
  code: string;
}

export async function getSms(phone: string) {
  const reponse = await api.post("/send-sms", phone); // dummy -> /dummy-send-sms
  const data = reponse.data as SmsResponse;

  return data;
}

export async function verifySms(params: VerifySmsResponse) {
  try {
    const response = await api.post("/verify-code", params); // dummy -> /dummy-verify-code
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const status = error.response?.status;

      if (status === 400) {
        throw new Error("Código de verificación incorrecto");
      }

      if (status === 404) {
        throw new Error("Número no encontrado");
      }

      if (status === 500) {
        throw new Error("Error en la verificación");
      }

      return error;
    }

    throw error;
  }
}
