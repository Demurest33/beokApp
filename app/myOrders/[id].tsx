import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  FlatList,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, Link } from "expo-router";
import { getOrderDetails, order_product, OrderStatus } from "@/services/orders";
import { useEffect, useState } from "react";
import useUserStore from "@/store/userStore";
import QrCode from "@/components/QrCode";
import MyPicker from "@/components/admin/Picker";
import { Role } from "@/types/User";
import { Ionicons } from "@expo/vector-icons";
import WhatsappLink from "@/components/WhatsappLink";

export default function OrderDetails() {
  const {
    id,
    payment_type,
    pick_up_date,
    status,
    total,
    message,
    created_at,
    hash,
    updated_at,
    name,
    last_name,
    phone,
  } = useLocalSearchParams();

  const [orderDetails, setOrderDetails] = useState<order_product[]>([]);
  const [loading, setLoading] = useState(true);
  const userStore = useUserStore();

  // darle formato a las fechas de created y updated

  useEffect(() => {
    async function fetchOrderDetails() {
      try {
        setLoading(true);
        const details = await getOrderDetails(Number(id)); // Llamamos a la API
        setOrderDetails(details);
      } catch (error) {
        console.error("Error al obtener los detalles del pedido:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrderDetails();
  }, [id]);

  const translatedStatus = {
    [OrderStatus.preparando]: "Preparando pedido",
    [OrderStatus.listo]: "Pedido listo",
    [OrderStatus.entregado]: "Pedido entregado",
    [OrderStatus.cancelado]: "Pedico cancelado",
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando detalles del pedido...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {userStore.user?.role === Role.ADMIN ||
        (userStore.user?.role === Role.AXULIAR && (
          <View style={styles.header}>
            <Text style={styles.headerText}>Pedido No° {id} </Text>
          </View>
        ))}
      <FlatList
        style={styles.body}
        ListHeaderComponent={
          <>
            <Text style={[styles.status, styles.title]}>
              {translatedStatus[status as OrderStatus]}
            </Text>

            <View
              style={{
                borderBottomColor: "#ccc",
                borderBottomWidth: 0.8,
              }}
            />
          </>
        }
        data={orderDetails}
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
        // bottomm componen
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
                  {pick_up_date.toString().split(" ")[0]}
                </Text>
              </View>

              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 2 }}
              >
                <Ionicons name="time" size={28} color="black" />
                <Text style={{ fontSize: 20 }}>
                  {pick_up_date.toString().split(" ")[1]}
                </Text>

                <Text style={{ fontSize: 20 }}>
                  {pick_up_date.toString().split(" ")[2]}
                </Text>
              </View>
            </View>

            <Text
              style={{ textAlign: "center", marginVertical: 10, fontSize: 16 }}
            >
              Pedido realizado:{" "}
              {new Date(created_at.toString()).toLocaleString()}
            </Text>
            <Text
              style={{ textAlign: "center", marginVertical: 10, fontSize: 16 }}
            >
              {status === OrderStatus.cancelado
                ? "Pedido cancelado: "
                : "Pedido entregado: "}
              {status === OrderStatus.entregado ||
              status === OrderStatus.cancelado
                ? new Date(updated_at.toString()).toLocaleString()
                : "------"}
            </Text>

            {userStore.user?.role === Role.ADMIN ||
            userStore.user?.role === Role.AXULIAR ? (
              <>
                <Text style={styles.subtitle}>Datos del cliente</Text>
                <View style={{ paddingHorizontal: 16, gap: 2 }}>
                  <Text style={{ fontSize: 18 }}>
                    {name} {last_name}
                  </Text>
                  <WhatsappLink phone={phone.toString()} />

                  <MyPicker
                    orderID={parseInt(id.toString())}
                    key={parseInt(id.toString())}
                  />
                </View>
              </>
            ) : (
              <QrCode pedidoId={hash.toString()} />
            )}
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
    color: "#2a9d8f",
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
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#3D9D3D",
    display: "flex",
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "center",
    paddingVertical: 4,
    alignItems: "center",
  },
  headerText: {
    color: "white",
    fontSize: 24,
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
  productHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
