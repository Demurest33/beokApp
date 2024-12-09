import { api } from "./api";
import { AxiosError } from "axios";
import { productWithOptions } from "@/types/Menu";
import { paymentType } from "@/store/cart";

export const statusColors = {
  preparando: "#E0B116", // Naranja
  listo: "#32CD32", // Verde
  entregado: "#1E90FF", // Azul
  cancelado: "#FF4500", // Rojo
};

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
  cancelation_msg: string;
  payment_type: string;
  pick_up_date: string;
  status: OrderStatus;
  total: number;
  updated_at: string;
  user_id: number;
  is_fav: boolean;
  hash: string;
  paid: boolean;
}

export interface adminOrderResponse {
  created_at: string;
  id: number;
  message: string;
  cancelation_msg: string;
  payment_type: string;
  pick_up_date: string;
  status: OrderStatus;
  total: number;
  updated_at: string;
  user_id: number;
  is_fav: boolean;
  hash: string;
  user: {
    id: number;
    name: string;
    lastname: string;
    phone: string;
  };
  paid: boolean;
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
  paid: boolean;
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
    // console.log("orderData", orderData);
    // console.log("selectedoptionprices", orderData.products[0].selectedOptions);
    // console.log(
    //   "selectedoptionprices",
    //   orderData.products[0].selectedOptionPrices
    // );

    // Intentar crear el pedido
    const response = await api.post("/orders", {
      ...orderData,
      user_id: userId,
    });

    // Si todo está bien, devolver la respuesta
    return response.data;
  } catch (error: unknown) {
    // Verificar si el error es de tipo AxiosError
    if (error instanceof AxiosError) {
      if (error.response) {
        // Manejo de errores basados en el código de estado
        const status = error.response.status;
        const errorData = error.response.data;

        switch (status) {
          case 400:
            throw new Error("Solicitud inválida. Revisa los datos ingresados.");

          // En caso de que sea 403 entonces que le cierre la sesion y lo regrese a login
          case 403:
            throw new Error("403");

          case 404:
            throw new Error("404");
          case 422:
            throw new Error(
              errorData?.error || "Datos no válidos para crear el pedido."
            );
          case 500:
            throw new Error(
              "Error en el servidor. Por favor, inténtalo más tarde."
            );
          default:
            throw new Error(
              errorData?.error ||
                "Ocurrió un error inesperado. Inténtalo más tarde."
            );
        }
      } else if (error.request) {
        // Si no hay respuesta del servidor
        throw new Error(
          "No se pudo conectar al servidor. Verifica tu conexión."
        );
      } else {
        // Error inesperado en la configuración de Axios
        throw new Error(`Error en la solicitud: ${error.message}`);
      }
    }

    // Si no es un error de Axios, lanzar un error genérico
    throw new Error("Error desconocido al crear el pedido.");
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

export async function reOrder(orderId: number) {
  const response = await api.post(`/orders/reorder`, {
    order_id: orderId,
  });

  if (response.status == 200) {
    return response.data.products;
  }
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

export async function updateOrderStatus(
  orderId: number,
  status: OrderStatus,
  message?: string
) {
  try {
    const response = await api.patch(`/orders/${orderId}/status`, {
      status,
      message,
    });

    return response.data;
  } catch (error) {
    console.error("Error al actualizar el estado del pedido:", error);

    return null;
  }
}

export async function tooglePaid(orderId: string) {
  try {
    const response = await api.patch(`/orders/${orderId}/toggle-paid`);

    if (response.status == 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al actualizar el estado del pedido:", error);

    return null;
  }
}
