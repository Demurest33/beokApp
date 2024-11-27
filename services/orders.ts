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
  is_fav: boolean;
  hash: string;
}

export enum OrderStatus {
  preparando = "preparando",
  listo = "listo",
  entregado = "entregado",
  cancelado = "cancelado",
}

export interface order_product {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  selected_options: { [key: string]: string };
  image_url: string;
  product_name: string;
  created_at: string;
  updated_at: string;
}

export interface decodeQrResponse {
  order: orderResponse;
  order_products: order_product[];
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

export async function toogleFavOrder(orderId: number) {
  const response = await api.patch(`/orders/${orderId}/favorite`);

  if (response.status == 200) {
    return response.data;
  }

  throw new Error("Hubo un problema marcando el pedido como favorito");
}

export async function reOrder(orderId: number, pick_up_date: string) {
  const response = await api.post(`/orders/reorder`, {
    order_id: orderId,
    pick_up_date,
  });

  if (response.status == 200) {
    return response.data;
  }

  console.log(response);

  throw new Error("Hubo un problema reordenando el pedido");
}

export async function decodeQr(hash: string) {
  try {
    const response = await api.post(`/decode-qr`, {
      hash: hash,
    });

    return response.data;
  } catch (error) {
    console.error("Error al decodificar el código QR:", error);

    return null;
  }
}
