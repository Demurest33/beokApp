import { router } from "expo-router";
import {
  StyleSheet,
  ActivityIndicator,
  View,
  Text,
  FlatList,
  RefreshControl,
} from "react-native";
import { getOrders } from "@/services/orders";
import { useEffect, useState } from "react";
import useUserStore from "@/store/userStore";
import PedidoComponent from "@/components/Pedido";

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

export default function TabTwoScreen() {
  const userStore = useUserStore();
  const [orders, setOrders] = useState<orderResponse[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [userStore.user, refreshing]);

  async function fetchOrders() {
    if (userStore.user !== null) {
      try {
        setLoading(true);
        const orders = await getOrders(parseInt(userStore.user.id));
        if (orders) {
          setOrders(orders);
        }
        setOrders(orders);
      } catch (error) {
        console.error("Error al obtener los pedidos:", error);
      } finally {
        setLoading(false);
      }
    }
  }

  if (userStore.user === null) {
    return (
      <View style={styles.container}>
        <Text>Debes iniciar sesión para ver tus pedidos</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={fetchOrders}
            colors={["#000"]}
          />
        }
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PedidoComponent {...item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});
