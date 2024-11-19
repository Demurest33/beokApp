import { router } from "expo-router";
import {
  StyleSheet,
  Image,
  Platform,
  View,
  Text,
  Pressable,
  FlatList,
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
  status: string;
  total: number;
  updated_at: string;
  user_id: number;
}

export default function TabTwoScreen() {
  const userStore = useUserStore();
  const [orders, setOrders] = useState<orderResponse[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    if (userStore.user !== null) {
      const orders = await getOrders(parseInt(userStore.user.id));
      if (orders) {
        setOrders(orders);
        console.log(orders);
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

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PedidoComponent {...item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
