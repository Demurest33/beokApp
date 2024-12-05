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

export default function TabTwoScreen() {
  const userStore = useUserStore();
  const [orders, setOrders] = useState<orderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [favourites, setFavourites] = useState<orderResponse[]>([]);
  const [showFavourites, setShowFavourites] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      const favs = orders.filter((order) => order.is_fav);
      setFavourites(favs);
    }
  }, [orders]);

  const goLogin = () => {
    router.push("/login");
  };

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

  const toogleshowFavourites = () => {
    setShowFavourites(!showFavourites);
  };

  if (userStore.user === null) {
    return (
      <Pressable style={styles.loginContainer} onPress={goLogin}>
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            textAlign: "center",
            padding: 16,
            maxWidth: 250,
            color: "gray",
          }}
        >
          Inicia sesión para ver tus pedidos
        </Text>
        <View style={styles.button}>
          <Ionicons name="log-in-sharp" size={32} color="white" />

          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </View>
      </Pressable>
    );
  }

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (showFavourites) {
    return (
      <>
        {/* Alinear estrella a la derecha */}

        <Pressable onPress={toogleshowFavourites} style={styles.header}>
          {showFavourites ? (
            <Text style={{ fontSize: 16, marginRight: 5 }}>Ver todos</Text>
          ) : (
            <Text style={{ fontSize: 16, marginRight: 5 }}>Ver favoritos</Text>
          )}

          <Ionicons
            name={showFavourites ? "star-sharp" : "star-outline"}
            size={32}
            color="#E0B116"
          />
        </Pressable>

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
          renderItem={({ item }) => (
            <PedidoComponent
              pedido={item}
              {...item}
              fetchOrders={fetchOrders}
            />
          )}
        />
      </>
    );
  }

  return (
    <>
      {!(orders.length > 0) ? (
        <ScrollView
          contentContainerStyle={styles.container} // Para centrar el contenido
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchOrders} />
          }
        >
          <Pressable style={styles.loginContainer}>
            <Ionicons name="document-text" size={80} color="gray" />
            <Text style={styles.text}>Aún no haces pedidos</Text>
          </Pressable>
        </ScrollView>
      ) : (
        <>
          <Pressable onPress={toogleshowFavourites} style={styles.header}>
            {showFavourites ? (
              <Text style={{ fontSize: 16, marginRight: 5 }}>Ver todos</Text>
            ) : (
              <Text style={{ fontSize: 16, marginRight: 5 }}>
                Ver favoritos
              </Text>
            )}

            <Ionicons
              name={showFavourites ? "star-sharp" : "star-outline"}
              size={32}
              color="#FFD700"
            />
          </Pressable>

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
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3D9D3D",
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    gap: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
