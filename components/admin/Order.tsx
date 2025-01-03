import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { decodeQrResponse, statusColors, tooglePaid } from "@/services/orders";
import MyPicker from "@/components/admin/Picker";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { UserWithOrderCounts } from "@/types/User";
import UserCard from "./UserCard";
import { getAllUsers } from "@/services/users";

export default function Order({ order }: { order: decodeQrResponse }) {
  const {
    id,
    payment_type,
    pick_up_date,
    status,
    total,
    message,
    created_at,
    updated_at,
    paid,
    user_id,
  } = order.order;

  const translatedStatus = {
    preparando: "Preparando pedido",
    listo: "Pedido listo",
    entregado: "Pedido entregado",
    cancelado: "Pedido cancelado",
  };

  const [loadingPaid, setLoadingPaid] = useState(false);
  const [myPaid, setMyPaid] = useState(paid);
  const [orderUser, setOrderUser] = useState<UserWithOrderCounts | null>(null);

  useEffect(() => {
    getOrderUser();
  }, []);

  const getOrderUser = async () => {
    const users = await getAllUsers(user_id.toString());
    setOrderUser(users[0]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.body}
        ListHeaderComponent={
          <>
            <Text
              style={[
                styles.status,
                styles.title,
                {
                  color: statusColors[status],
                },
              ]}
            >
              {translatedStatus[status]}
            </Text>
            <View
              style={{ borderBottomColor: "#ccc", borderBottomWidth: 0.8 }}
            />
          </>
        }
        data={order.order_products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 10 }}>
            <View style={styles.productHeader}>
              <Text style={styles.productName}>
                {`(${item.quantity})`} {item.product_name}
              </Text>
              <Text style={{ fontSize: 20 }}>${item.price}</Text>
            </View>

            <View>
              {Object.entries(item.selected_options).map(
                ([optionName, optionValue], index) => (
                  <Text key={index} style={styles.optionItem}>
                    {optionName}: {optionValue}
                  </Text>
                )
              )}
            </View>
          </View>
        )}
        ListFooterComponent={
          <>
            <View style={[styles.productHeader, { padding: 16 }]}>
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                Total {payment_type}
              </Text>
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>${total}</Text>
            </View>
            <Text style={styles.message}>{message || "Sin indicaciones"}</Text>
            <Text style={styles.subtitle}>Fecha de entrega</Text>
            <View
              style={[styles.productHeader, { justifyContent: "space-evenly" }]}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 2 }}
              >
                <Ionicons name="calendar" size={28} color="black" />
                <Text style={{ fontSize: 20 }}>
                  {pick_up_date.split(" ")[0]}
                </Text>
              </View>

              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 2 }}
              >
                <Ionicons name="time" size={28} color="black" />
                <Text style={{ fontSize: 20 }}>
                  {pick_up_date.split(" ")[1]}
                </Text>
                <Text style={{ fontSize: 20 }}>
                  {pick_up_date.split(" ")[2]}
                </Text>
              </View>
            </View>
            <Text
              style={{ textAlign: "center", marginVertical: 10, fontSize: 16 }}
            >
              Pedido realizado: {new Date(created_at).toLocaleString()}
            </Text>
            <Text
              style={{ textAlign: "center", marginVertical: 10, fontSize: 16 }}
            >
              {status === "cancelado"
                ? "Pedido cancelado: "
                : "Pedido entregado: "}
              {status === "entregado" || status === "cancelado"
                ? new Date(updated_at).toLocaleString()
                : "------"}
            </Text>

            {/* Informacion del usuario que hizo el pedido */}
            {orderUser && <UserCard user={orderUser} />}

            <MyPicker orderID={id} key={id} />

            <Pressable
              onPress={async () => {
                if (loadingPaid) return;
                setLoadingPaid(true);
                const res = await tooglePaid(id.toString());
                setLoadingPaid(false);

                if (res.success) {
                  setMyPaid(!myPaid);
                }
              }}
              style={[
                styles.button,
                {
                  backgroundColor: myPaid ? "#3D9D3D" : "#f00",
                },
              ]}
            >
              <Ionicons
                name={myPaid ? "checkmark-circle" : "close-circle"}
                size={24}
                color="white"
              />
              <Text style={styles.buttonText}>
                {myPaid ? "Pagado" : "No pagado"}
              </Text>
            </Pressable>
          </>
        }
        ListEmptyComponent={<Text>No hay productos en este pedido.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  status: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    backgroundColor: "#ccc",
    borderRadius: 5,
    marginHorizontal: 16,
  },
  productName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  optionItem: {
    fontSize: 16,
    marginLeft: 10,
    marginBottom: 2,
    color: "#555",
  },
  productHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  body: {
    marginTop: 10,
    marginHorizontal: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    flex: 1,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  button: {
    marginVertical: 20,
    backgroundColor: "#3D9D3D",
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
  },
});
