import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import { getOrders, orderResponse } from "@/services/orders";
import { useEffect, useState } from "react";
import useUserStore from "@/store/userStore";
import PedidoComponent from "@/components/admin/PedidosAdmin";

export default function OrdersScreen() {
  const userStore = useUserStore();

  const [orders, setOrders] = useState<orderResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    if (userStore.user !== null) {
      try {
        setLoading(true);
        const orders = await getOrders(parseInt(userStore.user.id));
        if (orders) {
          setOrders(orders);
        }
      } catch (error) {
        console.error("Error al obtener los pedidos:", error);
        alert("Error al obtener los pedidos");
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <View style={styles.stepContainer}>
      {loading ? (
        <Text>Cargando...</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(order) => order.id.toString()}
          renderItem={({ item }) => <PedidoComponent {...item} />}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchOrders} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
});
