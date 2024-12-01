import {
  StyleSheet,
  ActivityIndicator,
  View,
  Text,
  FlatList,
  RefreshControl,
  Pressable,
  ScrollView,
} from "react-native";
import { getOrders } from "@/services/orders";
import { useEffect, useState } from "react";
import useUserStore from "@/store/userStore";
import PedidoComponent from "@/components/Pedido";
import { orderResponse } from "@/services/orders";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

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

        console.log(orders.length);
      } catch (error) {
        console.error("Error al obtener los pedidos:", error);
        alert("Error al obtener los pedidos");
      } finally {
        setLoading(false);
      }
    }
  }

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <>
      {!(orders.length > 0) ? (
        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchOrders} />
          }
        >
          <Pressable style={styles.loginContainer}>
            <Ionicons name="document-text" size={80} color="gray" />
            <Text style={styles.text}>No hay pedidos</Text>
          </Pressable>
        </ScrollView>
      ) : (
        <>
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
            renderItem={({ item }) => (
              <PedidoComponent
                pedido={item}
                {...item}
                fetchOrders={fetchOrders}
              />
            )}
          />
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    padding: 16,
    maxWidth: 200,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
