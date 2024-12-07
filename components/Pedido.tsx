import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  orderResponse,
  toogleFavOrder,
  statusColors,
  reOrder,
  OrderStatus,
} from "@/services/orders";
import { useState } from "react";
import { productWithOptions } from "@/types/Menu";
import useCartStore from "@/store/cart";

interface props {
  pedido: orderResponse;
  fetchOrders: () => any;
}

export default function PedidoComponent({ pedido, fetchOrders }: props) {
  const [loading, setLoading] = useState(false);
  const [reorderLoading, setReorderLoading] = useState(false);
  const [isfav, setIsFav] = useState(pedido.is_fav);
  const { addProduct, clearCart, products } = useCartStore();

  const handlePressProduct = () => {
    router.push({
      pathname: `/myOrders/[id]`,
      params: {
        id: pedido.id,
        payment_type: pedido.payment_type,
        pick_up_date: pedido.pick_up_date,
        status: pedido.status,
        total: pedido.total,
        message: pedido.message,
        created_at: pedido.created_at,
        hash: pedido.hash,
        cancel_msg: pedido.cancelation_msg,
      },
    });
  };

  const toogleFav = async () => {
    if (loading) {
      return;
    }

    try {
      setLoading(true);
      await toogleFavOrder(pedido.id);
      setIsFav((prev) => !prev);
      await fetchOrders();
    } catch (error) {
      alert("Error al marcar como favorito");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const re_order = async () => {
    if (reorderLoading) {
      return;
    }

    try {
      setReorderLoading(true);
      const products = await reOrder(pedido.id);

      clearCart();

      // lo que retorna
      //[{"description": "Bistec al gusto con guarnición", "id": 12, "image_url": "https://thumbs.dreamstime.com/b/mexican-stake-bistec-la-mexicana-94492950.jpg", "name": "Bistec", "price": "50.00", "quantity": 1, "selectedOptions": {"Guarnición": "Arroz", "Preparación": "A la mexicana"}}]
      products.forEach((product: productWithOptions) => {
        // console.log(product);
        //log
        // {"description": "Bistec al gusto con guarnición", "id": 12, "image_url": "https://thumbs.dreamstime.com/b/mexican-stake-bistec-la-mexicana-94492950.jpg", "name": "Bistec", "price": "50.00", "quantity": 1, "selectedOptions": {"Guarnición": "Arroz", "Preparación": "A la mexicana"}}
        addProduct(product);
      });

      router.push("/(tabs)/carrito");
    } catch (error) {
      alert("Error al reordenar");
      console.log(error);
    } finally {
      setReorderLoading(false);
    }
  };

  const statusColor = statusColors[pedido.status];

  return (
    <>
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Cargando detalles del pedido...</Text>
        </View>
      )}
      <View style={styles.card}>
        {/* Franja de estado */}
        <View style={[styles.statusStrip, { backgroundColor: statusColor }]} />

        {/* Contenido de la tarjeta */}
        <View style={styles.cardContent}>
          <View style={styles.header}>
            {/* <Text style={styles.date}>
              {pedido.created_at.split("T")[0]} -{" "}
              {pedido.created_at.split("T")[1].split(".")[0]}
            </Text> */}

            <Text style={[styles.status, { color: statusColor }]}>
              Estado: {pedido.status}
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-evenly",
                width: 100,
              }}
            >
              <Text style={styles.total}>${pedido.total}</Text>

              <TouchableOpacity onPress={toogleFav}>
                <Ionicons
                  name={isfav ? "star-sharp" : "star-outline"}
                  size={24}
                  color="#FFD700"
                />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.details}>
            Método de pago: {pedido.payment_type}
          </Text>

          {pedido.status === OrderStatus.cancelado && (
            <Text style={styles.details}>
              Motivo de cancelación: {pedido.cancelation_msg}
            </Text>
          )}

          {/* Botón e interacción */}
          <View style={styles.actions}>
            <Pressable onPress={handlePressProduct} style={styles.detailButton}>
              <Text style={styles.detailButtonText}>Ver detalles</Text>
            </Pressable>

            <Pressable onPress={re_order} style={styles.reorderBtn}>
              {reorderLoading && (
                <ActivityIndicator size="small" color="#FFF" />
              )}
              <Text style={styles.detailButtonText}>Ordenar nuevamente</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 8,
    overflow: "hidden",
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 3, // Sombra en Android
    shadowColor: "#000", // Sombra en iOS
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  statusStrip: {
    width: 8,
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: "#555",
    fontWeight: "bold",
  },
  total: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
  details: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    marginTop: 12,
  },
  detailButton: {
    backgroundColor: "#3D9D3D",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  detailButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  reorderBtn: {
    backgroundColor: "#3D9D3D",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
    flexDirection: "row",
  },
});
