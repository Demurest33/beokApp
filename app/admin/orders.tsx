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
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { useEffect, useState } from "react";
import useUserStore from "@/store/userStore";
import PedidoComponent from "@/components/admin/PedidosAdmin";
import {
  getOrders,
  adminOrderResponse,
  OrderStatus,
  statusColors,
} from "@/services/orders";
import { Ionicons } from "@expo/vector-icons";

export default function OrdersScreen() {
  const userStore = useUserStore();
  const [orders, setOrders] = useState<adminOrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchedUser, setSearchedUser] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [filteredOrders, setFilteredOrders] = useState<adminOrderResponse[]>(
    []
  );

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchedUser, statusFilter]);

  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);

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

  function applyFilters() {
    let filtered = orders;

    if (searchedUser) {
      filtered = filtered.filter((order) =>
        order.user.phone.includes(searchedUser)
      );

      if (filtered.length === 0) {
        setFilteredOrders(filtered);
        return;
      }
    }

    if (statusFilter !== "todos") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }

  const pickeroptions = [
    { label: "Todos", value: "todos", color: "blue" },
    {
      label: "Preparando",
      value: OrderStatus.preparando,
      color: statusColors[OrderStatus.preparando],
    },
    {
      label: "Listo",
      value: OrderStatus.listo,
      color: statusColors[OrderStatus.listo],
    },
    {
      label: "Entregado",
      value: OrderStatus.entregado,
      color: statusColors[OrderStatus.entregado],
    },
    {
      label: "Cancelado",
      value: OrderStatus.cancelado,
      color: statusColors[OrderStatus.cancelado],
    },
  ];

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
          <View style={styles.topInputs}>
            <Pressable onPress={() => setModalVisible(true)}>
              <Ionicons name="search" size={24} color="black" />
            </Pressable>
            <TextInput
              keyboardType="phone-pad"
              style={styles.input}
              placeholder="Buscar por número de teléfono"
              onChangeText={(text) => setSearchedUser(text || null)}
            />
          </View>

          <FlatList
            ListEmptyComponent={
              <View style={styles.empty}>
                <Ionicons name="document-text" size={80} color="gray" />
                <Text style={styles.text}>No hay pedidos</Text>
              </View>
            }
            contentContainerStyle={{
              flexDirection: "column-reverse",
            }}
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={fetchOrders}
                colors={["#000"]}
              />
            }
            data={filteredOrders}
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

      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <Pressable
            style={styles.modalBackground}
            onPress={() => setModalVisible(false)}
          >
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <FlatList
                  style={{ width: "100%" }}
                  data={pickeroptions}
                  keyExtractor={(item) => item.value}
                  renderItem={({ item }) => (
                    <Pressable
                      onPress={() => {
                        setStatusFilter(item.value);
                        setModalVisible(false);
                      }}
                    >
                      <View
                        style={[styles.option, { borderLeftColor: item.color }]}
                      >
                        <Text style={styles.optionText}>{item.label}</Text>
                      </View>
                    </Pressable>
                  )}
                />
              </View>
            </TouchableWithoutFeedback>
          </Pressable>
        </TouchableWithoutFeedback>
      </Modal>
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
    flex: 1,
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
  topInputs: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    paddingHorizontal: 16,
    backgroundColor: "white",
    margin: "auto",
    gap: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: "bold",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "100%",
    borderLeftWidth: 5,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderTopColor: "#ccc",
    borderRightColor: "#ccc",
    borderBottomColor: "#ccc",
  },
  optionText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});
