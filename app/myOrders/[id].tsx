import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  FlatList,
  Linking,
  Alert,
} from "react-native";
import { useLocalSearchParams, Link } from "expo-router";
import {
  getOrderDetails,
  order_product,
  OrderStatus,
  statusColors,
  tooglePaid,
} from "@/services/orders";
import { useEffect, useState } from "react";
import useUserStore from "@/store/userStore";
import QrCode from "@/components/QrCode";
import MyPicker from "@/components/admin/Picker";
import { Role } from "@/types/User";
import { Ionicons } from "@expo/vector-icons";
import WhatsappLink from "@/components/WhatsappLink";
import { paymentType } from "@/store/cart";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";

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
    cancel_msg,
    paid,
  } = useLocalSearchParams();

  const [orderDetails, setOrderDetails] = useState<order_product[]>([]);
  const [loading, setLoading] = useState(true);
  const userStore = useUserStore();
  const [loadingPaid, setLoadingPaid] = useState(false);

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
    [OrderStatus.cancelado]: "Pedido cancelado",
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando detalles del pedido...</Text>
      </View>
    );
  }

  const numero_cuenta = "4189 1431 1738 8119";
  const banco = "Banorte";
  const whatsapp = "2291204831";

  const enviarComprobante = () => {
    const url = `whatsapp://send?phone=${whatsapp}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert(
            "No se puede abrir WhatsApp",
            "Puede que no tenga WhatsApp instalado en su dispositivo"
          );
        }
      })
      .catch((err) => console.error("Error al abrir WhatsApp", err));
  };

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(numero_cuenta);
  };

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
            <Text
              style={[
                styles.status,
                styles.title,
                {
                  color: statusColors[status as OrderStatus],
                },
              ]}
            >
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
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>Total</Text>
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
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 2,
                }}
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

            {/* <Text
              style={{ textAlign: "center", marginVertical: 10, fontSize: 14 }}
            >
              Pedido realizado:{" "}
              {new Date(created_at.toString()).toLocaleString()}
            </Text> */}

            {status === OrderStatus.cancelado && (
              <View style={{ marginTop: 10 }}>
                <Text style={styles.subtitle}>Motivo de cancelación</Text>
                <Text style={styles.message}>{cancel_msg}</Text>
              </View>
            )}

            {userStore.user?.role === Role.ADMIN ||
            userStore.user?.role === Role.AXULIAR ? (
              <>
                <Text style={[styles.subtitle, { marginTop: 8 }]}>
                  Datos del cliente
                </Text>

                <View style={styles.user}>
                  <View style={{ flexDirection: "column" }}>
                    <Text style={styles.userText}>
                      {name} {last_name}
                    </Text>

                    <WhatsappLink phone={phone.toString()} />
                  </View>
                </View>

                <View style={{ paddingHorizontal: 16, gap: 2 }}>
                  <MyPicker
                    orderID={parseInt(id.toString())}
                    key={parseInt(id.toString())}
                  />

                  <Pressable
                    onPress={async () => {
                      setLoadingPaid(true);
                      await tooglePaid(id.toString());
                      setLoadingPaid(false);
                      router.push("/admin/orders");
                    }}
                    style={[
                      styles.button,
                      {
                        backgroundColor: paid == "si" ? "#3D9D3D" : "#FF0000",
                      },
                    ]}
                  >
                    {loadingPaid ? (
                      <ActivityIndicator size="large" color="#fff" />
                    ) : (
                      <>
                        <Ionicons
                          name={
                            paid == "si"
                              ? "checkmark-circle"
                              : "close-circle-outline"
                          }
                          size={24}
                          color="white"
                        />
                        <Text style={styles.buttonText}>
                          {paid == "si" ? "Pagado" : "No pagado"}
                        </Text>
                      </>
                    )}
                  </Pressable>
                </View>
              </>
            ) : (
              <>
                <Text
                  style={[styles.subtitle, { marginTop: 20, marginBottom: 0 }]}
                >
                  Método de pago: {payment_type}
                </Text>

                <QrCode pedidoId={hash.toString()} />

                <View
                  style={{
                    flexDirection: "row",
                    padding: 10,
                  }}
                >
                  {payment_type === paymentType.efectivo ? (
                    <Text
                      style={[
                        styles.subtext,
                        {
                          marginBottom: 20,
                        },
                      ]}
                    >
                      Presenta este QR en mostador y realiza tu pago por{" "}
                      <Text style={{ fontWeight: "bold" }}>${total}</Text> para
                      que te entregen tus alimentos.
                    </Text>
                  ) : (
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.subtext}>
                        Realiza tu transferencia por{" "}
                        <Text style={{ fontWeight: "bold" }}>${total}</Text>{" "}
                        para que te entreguen tus alimentos.
                      </Text>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-evenly",
                          gap: 8,
                          marginTop: 8,
                        }}
                      >
                        <Text
                          style={{
                            ...styles.subtext,
                            marginTop: 4,
                            color: "#FF0000",
                            fontWeight: "bold",
                          }}
                        >
                          {banco}
                        </Text>
                        <Pressable onPress={copyToClipboard}>
                          <Text
                            style={{
                              ...styles.subtext,
                              marginTop: 4,
                              fontWeight: "bold",
                              textDecorationStyle: "solid",
                              textDecorationLine: "underline",
                            }}
                          >
                            {numero_cuenta}
                          </Text>
                        </Pressable>
                      </View>

                      <Pressable
                        style={styles.button}
                        onPress={enviarComprobante}
                      >
                        <Text style={styles.buttonText}>
                          Enviar comprobante
                        </Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              </>
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
  subtext: { fontSize: 20 },
  button: {
    marginVertical: 20,
    backgroundColor: "#3D9D3D",
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  user: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderWidth: 1,
    borderBottomColor: "gray",
    borderStyle: "solid",
    borderRadius: 8,
    marginBottom: 10,
  },
  userText: {
    fontSize: 18,
  },
});
