import { api } from "./api";
import { AxiosError } from "axios";
import { productWithOptions } from "@/types/Menu";
import { paymentType } from "@/store/cart";

export interface Order {
  products: productWithOptions[];
  pick_up_date: string;
  payment_type: paymentType;
  total: number;
  additionalInstructions?: string;
}

export interface OrderResponse {
  id: number;
  user_id: number;
  products: productWithOptions[];
  pick_up_date: Date;
  payment_type: paymentType;
  total: number;
  additionalInstructions?: string;
}

export enum OrderStatus {
  preparing = "pending",
  ready = "ready",
  delivered = "delivered",
  canceled = "canceled",
}

export async function createOrder(orderData: Order, userId: number) {
  try {
    const response = await api.post("/orders", {
      ...orderData,
      user_id: userId,
    });

    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error(
        "Error al crear el pedido:",
        error.response?.data || error.message
      );
      return error.response?.data; // Devuelve el error si es de Axios
    }
    console.error("Error inesperado:", error);
    return null;
  }
}

export async function getOrders(userId: number) {
  try {
    const response = await api.post("/get-orders", {
      user_id: userId,
    });
    console.log(response.data);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error(
        "Error al obtener las órdenes:",
        error.response?.data || error.message
      );
      return error.response?.data; // Devuelve el error si es de Axios
    }
    console.error("Error inesperado:", error);
    return null;
  }
}
