import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { getUser } from "@/store/sharedPreferences";
import { useEffect, useState } from "react";
import useUserStore from "@/store/userStore";
import { User, Role } from "@/types/User";
import { router } from "expo-router";
import CategoryComponent from "@/components/Category";

//Menu imports
import { Menu, Category, Product } from "@/types/Menu";
import { getMenu } from "@/services/menu";

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState<Menu | null>(null);
  const userStore = useUserStore();

  useEffect(() => {
    getUserData();
    fetchMenu();
  }, []);

  async function fetchMenu() {
    try {
      const menu: Menu = await getMenu();
      setMenu(menu);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function getUserData() {
    try {
      const user: User = await getUser();
      if (user !== null) {
        userStore.setUser(user);

        if (user.role === Role.ADMIN || user.role === Role.AXULIAR) {
          router.replace("/admin");
        }

        if (user.role === Role.CLIENTE) {
          router.replace("/(tabs)/");
        }
      }
    } catch (error) {
      alert("Error al obtener los datos del usuario");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={menu?.categories}
          keyExtractor={(category) => category.id.toString()}
          renderItem={({ item }) => <CategoryComponent category={item} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  category: { marginBottom: 20 },
  categoryName: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  product: { marginBottom: 15, alignItems: "center" },
  image: { width: 100, height: 100, borderRadius: 10 },
  productName: { fontSize: 16, fontWeight: "bold" },
  description: { fontSize: 14, color: "gray" },
  price: { fontSize: 14, color: "green" },
});
