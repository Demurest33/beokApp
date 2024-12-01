import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";
import CustomDrawerContent from "@/components/admin/CustomDrawerContent";
import { router } from "expo-router";
import useUserStore from "@/store/userStore";
import { Role } from "@/types/User";
import { Alert } from "react-native";

export default function Layout() {
  const { user } = useUserStore();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />}>
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: "Escaner",
            title: "Escanear código QR",
            headerTintColor: "#fff",
            headerStyle: {
              backgroundColor: "#3D9D3D",
            },

            drawerIcon: ({ focused, size }) => (
              <Ionicons
                name="qr-code-outline"
                size={size}
                color={focused ? "#3D9D3D" : "#ccc"}
              />
            ),
          }}
        />

        <Drawer.Screen
          name="orders"
          options={{
            drawerLabel: "Pedidos",
            title: "Pedidos de los clientes",
            headerTintColor: "#fff",
            headerStyle: {
              backgroundColor: "#3D9D3D",
            },

            drawerIcon: ({ focused, size }) => (
              <Ionicons
                name="cart-outline"
                size={size}
                color={focused ? "#3D9D3D" : "#ccc"}
              />
            ),
          }}
        />

        <Drawer.Screen
          name="users"
          listeners={{
            drawerItemPress: (event) => {
              if (user?.role !== Role.ADMIN) {
                event.preventDefault(); // Evitar navegación
                Alert.alert("No tienes permisos para acceder a esta sección");
              }
            },
          }}
          options={{
            drawerLabel: "Usuarios",
            title: "Administrar usuarios",
            headerTintColor: "#fff",
            headerStyle: {
              backgroundColor: "#3D9D3D",
            },

            drawerIcon: ({ focused, size }) => (
              <Ionicons
                name="people-outline"
                size={size}
                color={focused ? "#3D9D3D" : "#ccc"}
              />
            ),
          }}
        />

        <Drawer.Screen
          name="menu"
          listeners={{
            drawerItemPress: (event) => {
              if (user?.role !== Role.ADMIN) {
                event.preventDefault(); // Evitar navegación
                Alert.alert("No tienes permisos para acceder a esta sección");
              }
            },
          }}
          options={{
            drawerLabel: "Menu",
            title: "Administrar menu",
            headerTintColor: "#fff",
            headerStyle: {
              backgroundColor: "#3D9D3D",
            },

            drawerIcon: ({ focused, size }) => (
              <Ionicons
                name="fast-food-outline"
                size={size}
                color={focused ? "#3D9D3D" : "#ccc"}
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
                color={focused ? "#3D9D3D" : "#ccc"}
              />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
