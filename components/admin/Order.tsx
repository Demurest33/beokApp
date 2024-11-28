import { View, Text, StyleSheet, FlatList } from "react-native";
import { decodeQrResponse } from "@/services/orders";
import MyPicker from "./Picker";

export default function Order({ order }: { order: decodeQrResponse }) {
  const {
    id,
    payment_type,
    pick_up_date,
    status,
    total,
    message,
    created_at,
    hash,
  } = order.order;

  return (
    <FlatList
      style={styles.container}
      ListHeaderComponent={
        <View>
          <Text style={styles.title}>Detalles del Pedido</Text>
          <Text style={styles.subtitle}>Pedido No° {id}</Text>
          <Text style={styles.status}>Estado: {status}</Text>
          <Text style={styles.info}>Fecha de recogida: {pick_up_date}</Text>
          <Text style={styles.info}>Método de pago: {payment_type}</Text>
          <Text style={styles.info}>Total: ${total}</Text>
          <Text style={styles.message}>
            Indicaciones: {message || "Sin indicaciones"}
          </Text>
        </View>
      }
      data={order.order_products}
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
      ListFooterComponent={<MyPicker orderID={id} key={id} />}
      ListEmptyComponent={<Text>No hay productos en este pedido.</Text>}
    />
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
