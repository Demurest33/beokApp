import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useLocalSearchParams, Link } from "expo-router";
import { getOrderDetails } from "@/services/orders";
import { useEffect, useState } from "react";

interface order_product {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  selected_options: { [key: string]: string }; // Cambié el tipo de selected_options para que sea un objeto
  image_url: string;
  product_name: string;
  created_at: string;
  updated_at: string;
}

export default function OrderDetails() {
  const { id, payment_type, pick_up_date, status, total, message, created_at } =
    useLocalSearchParams();

  const [orderDetails, setOrderDetails] = useState<order_product[]>([]);
  const [loading, setLoading] = useState(true);
  const [preciototal, setPrecioTotal] = useState(0);

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
      <Text style={styles.title}>Detalles del Pedido</Text>
      <Text style={styles.subtitle}>Pedido No° {id}</Text>
      <Text style={styles.status}>Estado: {status}</Text>
      <Text style={styles.info}>Fecha de recogida: {pick_up_date}</Text>
      <Text style={styles.info}>Método de pago: {payment_type}</Text>
      <Text style={styles.info}>Total: ${total}</Text>
      <Text style={styles.message}>
        Observaciones: {message || "Sin observaciones"}
      </Text>

      <FlatList
        data={orderDetails}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.productContainer}>
            <Text style={styles.productName}>{item.product_name}</Text>
            <Text style={styles.productInfo}>Cantidad: {item.quantity}</Text>
            <Text style={styles.productInfo}>Precio: ${item.price}</Text>

            {/* Mostrar las opciones seleccionadas */}
            <Text style={styles.productInfo}>Opciones seleccionadas:</Text>
            {Object.entries(item.selected_options).map(
              ([optionName, optionValue], index) => (
                <Text key={index} style={styles.optionItem}>
                  {optionName}: {optionValue}
                </Text>
              )
            )}
          </View>
        )}
        ListEmptyComponent={<Text>No hay productos en este pedido.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  status: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2a9d8f",
    marginBottom: 8,
  },
  info: {
    fontSize: 16,
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    fontStyle: "italic",
    marginBottom: 12,
  },
  productContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  productInfo: {
    fontSize: 14,
    marginBottom: 2,
  },
  optionItem: {
    fontSize: 14,
    marginLeft: 10,
    marginBottom: 2,
    color: "#555",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
