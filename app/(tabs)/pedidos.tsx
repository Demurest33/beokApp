import {
  StyleSheet,
  ActivityIndicator,
  View,
  Text,
  FlatList,
  RefreshControl,
  Switch,
} from "react-native";
import { getOrders } from "@/services/orders";
import { useEffect, useState } from "react";
import useUserStore from "@/store/userStore";
import PedidoComponent from "@/components/Pedido";
import { orderResponse } from "@/services/orders";

export default function TabTwoScreen() {
  const userStore = useUserStore();
  const [orders, setOrders] = useState<orderResponse[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [favourites, setFavourites] = useState<orderResponse[]>([]);
  const [showFavourites, setShowFavourites] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [userStore.user, refreshing]);

  useEffect(() => {
    if (orders.length > 0) {
      const favs = orders.filter((order) => order.is_fav);
      setFavourites(favs);
    }
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

  if (userStore.user === null) {
    return (
      <View style={styles.container}>
        <Text>Debes iniciar sesión para ver tus pedidos</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!orders) {
    return (
      <View style={styles.container}>
        <Text>No se encontraron pedidos</Text>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No tienes pedidos</Text>
      </View>
    );
  }

  if (showFavourites) {
    return (
      <>
        <Switch
          value={showFavourites}
          onValueChange={(value) => setShowFavourites(value)}
        />

        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={fetchOrders}
              colors={["#000"]}
            />
          }
          data={favourites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <PedidoComponent {...item} />}
        />
      </>
    );
  }

  return (
    <>
      <Switch
        value={showFavourites}
        onValueChange={(value) => setShowFavourites(value)}
      />

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
        renderItem={({ item }) => <PedidoComponent {...item} />}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {},
});
