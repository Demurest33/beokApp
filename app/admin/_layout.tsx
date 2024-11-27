import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";
import CustomDrawerContent from "@/components/admin/CustomDrawerContent";
import { router } from "expo-router";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />}>
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: "Escaner",
            title: "Escanear pedido",
            drawerIcon: ({ focused, size }) => (
              <Ionicons
                name="qr-code-outline"
                size={size}
                color={focused ? "#7cc" : "#ccc"}
              />
            ),
          }}
        />

        <Drawer.Screen
          name="users"
          options={{
            drawerLabel: "Usuarios",
            title: "Administrar usuarios",
            drawerIcon: ({ focused, size }) => (
              <Ionicons
                name="people-outline"
                size={size}
                color={focused ? "#7cc" : "#ccc"}
              />
            ),
          }}
        />

        <Drawer.Screen
          name="menu"
          options={{
            drawerLabel: "Menu",
            title: "Administrar menu",
            drawerIcon: ({ focused, size }) => (
              <Ionicons
                name="fast-food-outline"
                size={size}
                color={focused ? "#7cc" : "#ccc"}
              />
            ),
          }}
        />

        <Drawer.Screen
          name="orders"
          options={{
            drawerLabel: "Pedidos",
            title: "Pedidos de los clientes",
            drawerIcon: ({ focused, size }) => (
              <Ionicons
                name="cart-outline"
                size={size}
                color={focused ? "#7cc" : "#ccc"}
              />
            ),
          }}
        />

        <Drawer.Screen
          listeners={() => ({
            drawerItemPress: () => {
              router.replace("/login");
            },
          })}
          name="logout"
          options={{
            drawerLabel: "Cerrar sesión",
            title: "Cerrar sesión",
            drawerIcon: ({ focused, size }) => (
              <Ionicons
                name="log-out-outline"
                size={size}
                color={focused ? "#7cc" : "#ccc"}
              />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
