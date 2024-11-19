import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface orderResponse {
  created_at: string;
  id: number;
  message: string;
  payment_type: string;
  pick_up_date: string;
  status: status;
  total: number;
  updated_at: string;
  user_id: number;
}

enum status {
  preparing = "preparing",
  ready = "ready",
  delivered = "delivered",
  cancelled = "cancelled",
}

export default function PedidoComponent(pedido: orderResponse) {
  const handlePressProduct = () => {
    router.push({
      pathname: `/myOrders/[id]`,
      params: {
        id: pedido.id,
      },
    });
  };

  const statusColors = {
    preparing: "#FFA500", // Naranja
    ready: "#32CD32", // Verde
    delivered: "#1E90FF", // Azul
    cancelled: "#FF4500", // Rojo
  };

  const statusColor = statusColors[pedido.status];

  return (
    <View style={styles.card}>
      {/* Franja de estado */}
      <View style={[styles.statusStrip, { backgroundColor: statusColor }]} />

      {/* Contenido de la tarjeta */}
      <View style={styles.cardContent}>
        <View style={styles.header}>
          <Text style={styles.date}>{pedido.pick_up_date}</Text>
          <Text style={styles.total}>${pedido.total.toFixed(2)}</Text>
        </View>

        <Text style={[styles.status, { color: statusColor }]}>
          Estado: {pedido.status}
        </Text>

        <Text style={styles.details}>
          Método de pago: {pedido.payment_type}
        </Text>
        <Text style={styles.details}>Observaciones: {pedido.message}</Text>

        {/* Botón e interacción */}
        <View style={styles.actions}>
          <Pressable onPress={handlePressProduct} style={styles.detailButton}>
            <Text style={styles.detailButtonText}>Ver detalles</Text>
          </Pressable>
          <TouchableOpacity>
            <Ionicons name="star-outline" size={24} color="#FFD700" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
    marginBottom: 8,
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
});
