import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import { router } from "expo-router";

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

export default function PedidoComponent(pedido: orderResponse) {
  const handlePressProduct = () => {
    router.push({
      pathname: `/myOrders/[id]`,
      params: {
        id: pedido.id,
      },
    });
  };

  //componente para 1 solo pedido
  return (
    <View style={styles.container}>
      <Pressable onPress={handlePressProduct}>
        <Text>Ver detalles</Text>
      </Pressable>
      <Text>Order ID: {pedido.id}</Text>
      <Text>Fecha de recogida: {pedido.pick_up_date}</Text>
      <Text>Metodo de pago: {pedido.payment_type}</Text>
      <Text>Total: {pedido.total}</Text>
      <Text>Estado: {pedido.status}</Text>
      <Text>Observaciones: {pedido.message}</Text>
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
