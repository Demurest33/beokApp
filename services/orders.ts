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

export interface orderResponse {
  created_at: string;
  id: number;
  message: string;
  payment_type: string;
  pick_up_date: string;
  status: OrderStatus;
  total: number;
  updated_at: string;
  user_id: number;
}

export enum OrderStatus {
  preparando = "preparando",
  listo = "listo",
  entregado = "entregado",
  cancelado = "cancelado",
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

export async function getOrderDetails(orderId: number) {
  const response = await api.get(`/orders/${orderId}/order-products`);

  if (response.data.success == true) {
    return response.data.order_products;
  }

  throw new Error("Hubo un problema obteniendo el detalle de el pedido");
}
