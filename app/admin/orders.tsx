import {
  StyleSheet,
  ActivityIndicator,
  View,
  Text,
  FlatList,
  RefreshControl,
  Pressable,
  ScrollView,
  TextInput,
} from "react-native";
import { getOrders } from "@/services/orders";
import { useEffect, useState } from "react";
import useUserStore from "@/store/userStore";
import PedidoComponent from "@/components/admin/PedidosAdmin";
import { adminOrderResponse } from "@/services/orders";
import { Ionicons } from "@expo/vector-icons";

export default function OrdersScreen() {
  const userStore = useUserStore();
  const [orders, setOrders] = useState<adminOrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchedUser, setSearchedUser] = useState<string | null>(null);

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
          <Pressable style={styles.empty}>
            <Ionicons name="document-text" size={80} color="gray" />
            <Text style={styles.text}>No hay pedidos</Text>
          </Pressable>
        </ScrollView>
      ) : (
        <View style={styles.container2}>
          <TextInput
            keyboardType="phone-pad"
            style={styles.input}
            onChange={(event) => {
              if (event.nativeEvent.text === "") {
                setSearchedUser(null);
              }
            }}
            placeholder="Buscar por número de teléfono"
            onEndEditing={(event) => {
              setSearchedUser(event.nativeEvent.text);
            }}
          />

          <FlatList
            ListEmptyComponent={
              <View style={styles.empty}>
                <Ionicons name="document-text" size={80} color="gray" />
                <Text style={styles.text}>No hay pedidos</Text>
              </View>
            }
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={fetchOrders}
                colors={["#000"]}
              />
            }
            data={
              searchedUser
                ? orders.filter((order) => order.user.phone === searchedUser)
                : orders
            }
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <PedidoComponent
                pedido={item}
                {...item}
                fetchOrders={fetchOrders}
              />
            )}
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
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
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    padding: 8,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container2: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
  },
});
