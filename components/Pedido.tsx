import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { orderResponse, toogleFavOrder } from "@/services/orders";
import { useState } from "react";
import { reOrder } from "@/services/orders";

export default function PedidoComponent(pedido: orderResponse) {
  const [loading, setLoading] = useState(false);
  const [isfav, setIsFav] = useState(pedido.is_fav);
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
      },
    });
  };

  const statusColors = {
    preparando: "#FFA500", // Naranja
    listo: "#32CD32", // Verde
    entregado: "#1E90FF", // Azul
    cancelado: "#FF4500", // Rojo
  };

  const toogleFav = async () => {
    if (loading) {
      return;
    }

    try {
      setLoading(true);
      await toogleFavOrder(pedido.id);
      setIsFav((prev) => !prev);
    } catch (error) {
      alert("Error al marcar como favorito");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const re_order = async () => {
    if (loading) {
      return;
    }

    // crear una nueva fecha con el tiempo actual de mexico y sumarle 30min para la nueva orden
    const now = new Date();
    const utcOffset = now.getTimezoneOffset() * 60000; // Diferencia UTC en milisegundos
    const mexicoOffset = -6 * 60 * 60 * 1000; // UTC-6 (tiempo estándar de México)
    const mexicoTime = new Date(now.getTime() + utcOffset + mexicoOffset);

    // Sumar 30 minutos

    const thirtyMinutesBeforePickup = new Date(
      mexicoTime.getTime() + 30 * 60 * 1000
    );

    try {
      setLoading(true);
      const res = await reOrder(
        pedido.id,
        thirtyMinutesBeforePickup.toLocaleDateString() +
          " " +
          thirtyMinutesBeforePickup.toLocaleTimeString()
      );
      alert(res.message);
    } catch (error) {
      alert("Error al crear la orden");
      console.log(error);
    } finally {
      setLoading(false);
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

            <Text style={styles.total}>${pedido.total}</Text>
          </View>

          <Text style={styles.details}>
            Método de pago: {pedido.payment_type}
          </Text>

          {/* Botón e interacción */}
          <View style={styles.actions}>
            <Pressable onPress={handlePressProduct} style={styles.detailButton}>
              <Text style={styles.detailButtonText}>Ver detalles</Text>
            </Pressable>

            <Pressable onPress={re_order} style={styles.detailButton}>
              <Text style={styles.detailButtonText}>Ordenar nuevamente</Text>
            </Pressable>

            <TouchableOpacity onPress={toogleFav}>
              <Ionicons
                name={isfav ? "star-sharp" : "star-outline"}
                size={24}
                color="#FFD700"
              />
            </TouchableOpacity>
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
    fontWeight: "600",
    marginBottom: 8,
  },
  details: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  detailButton: {
    backgroundColor: "#1E90FF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
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
});
