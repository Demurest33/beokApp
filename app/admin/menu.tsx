import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TextInput,
  RefreshControl,
} from "react-native";
import { useState, useEffect } from "react";
import { getAdminMenu } from "@/services/menu";
import { Category, Product } from "@/types/Menu";
import ProductCard from "@/components/admin/ProductCard";

export default function MenuScreen() {
  const [loading, setLoading] = useState(false);
  const [menu, setMenu] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState(""); // Estado para el texto del filtro
  const [filteredMenu, setFilteredMenu] = useState<Category[]>([]); // Estado para el menú filtrado

  useEffect(() => {
    fetchMenu();
  }, []);

  useEffect(() => {
    filterMenu();
  }, [searchQuery, menu]); // Actualiza el filtro cuando cambian el texto de búsqueda o el menú

  async function fetchMenu() {
    try {
      setLoading(true);
      const menu = await getAdminMenu();

      if (menu.length === 0) {
        alert("No menu found");
        return;
      }
      setMenu(menu);
      setFilteredMenu(menu); // Inicializa el menú filtrado con todos los elementos
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function filterMenu() {
    if (!searchQuery) {
      setFilteredMenu(menu); // Si no hay texto, muestra todo el menú
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = menu
      .map((category) => ({
        ...category,
        products: category.products?.filter((product) =>
          product.name.toLowerCase().includes(query)
        ),
      }))
      .filter((category) => category.products!.length > 0); // Excluye categorías sin productos

    setFilteredMenu(filtered);
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar producto..."
        value={searchQuery}
        onChangeText={setSearchQuery} // Actualiza el texto del filtro
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={filteredMenu}
          keyExtractor={(category) => category.id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchMenu}
              colors={["#0000ff"]}
            />
          }
          renderItem={({ item }) => (
            <View style={styles.category}>
              <Text style={styles.categoryName}>
                {item.name === "Todo el day" ? "Todo el día" : item.name}
              </Text>
              <FlatList
                data={item.products}
                keyExtractor={(product) => product.id.toString()}
                renderItem={({ item }) => <ProductCard product={item} />}
              />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  searchInput: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  category: { marginBottom: 24, padding: 10, backgroundColor: "#fff" },
  categoryName: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
});
