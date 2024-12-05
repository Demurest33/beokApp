import { View, Text, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";
import { adminOrderResponse, statusColors } from "@/services/orders";
import { Ionicons } from "@expo/vector-icons";

interface PedidoComponentProps {
  pedido: adminOrderResponse;
  fetchOrders: () => void;
}

export default function PedidoComponent({
  pedido,
  fetchOrders,
}: PedidoComponentProps) {
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
        updated_at: pedido.updated_at,
        hash: pedido.hash,
        name: pedido.user.name,
        last_name: pedido.user.lastname,
        phone: pedido.user.phone,
        cancel_msg: pedido.cancelation_msg,
        paid: pedido.paid ? "si" : "no",
      },
    });
  };

  const statusColor = statusColors[pedido.status];

  return (
    <>
      <Pressable onPress={handlePressProduct} style={styles.card}>
        {/* Franja de estado */}
        <View style={[styles.statusStrip, { backgroundColor: statusColor }]} />

        <View style={styles.cardContent}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.status]}>
                {pedido.user.name} {pedido.user.lastname}
              </Text>
              <Text style={styles.date}>{pedido.pick_up_date}</Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Ionicons
                name={pedido.paid ? "checkmark-circle" : "close-circle"}
                size={24}
                color={pedido.paid ? "green" : "red"}
              />

              <Text style={styles.total}>${pedido.total}</Text>
            </View>
          </View>

          <Text style={styles.details}>
            <Text style={{ fontWeight: "800" }}>Método de pago:</Text>{" "}
            {pedido.payment_type}
          </Text>

          {pedido.cancelation_msg && (
            <Text style={styles.details}>
              <Text style={{ fontWeight: "800" }}>Motivo de cancelación:</Text>{" "}
              {pedido.cancelation_msg}
            </Text>
          )}
        </View>
      </Pressable>
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
    width: 12,
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: "#555",
  },
  total: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },
  status: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
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
