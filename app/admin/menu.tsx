import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
} from "react-native";
import { useState, useEffect } from "react";
import { getMenu } from "@/services/menu";
import { Menu, Category, Product } from "@/types/Menu";

export default function MenuScreen() {
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState<Menu | null>(null);

  useEffect(() => {
    fetchMenu();
  }, []);

  async function fetchMenu() {
    try {
      const menu = await getMenu();
      setMenu(menu);
    } catch (error) {
      console.error(error);
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
          renderItem={({ item }) => <CategoryCard category={item} />}
        />
      )}
    </View>
  );
}

const ProductCard = ({ product }: { product: Product }) => (
  <View style={styles.product}>
    <Image source={{ uri: product.image_url }} style={styles.image} />
    <Text style={styles.productName}>{product.name}</Text>
    <Text style={styles.description}>{product.description}</Text>
    <Text style={styles.price}>${product.price.toFixed(2)}</Text>
  </View>
);

const CategoryCard = ({ category }: { category: Category }) => (
  <View style={styles.category}>
    <Text style={styles.categoryName}>{category.name}</Text>
    <FlatList
      data={category.products}
      keyExtractor={(product) => product.id.toString()}
      renderItem={({ item }) => <ProductCard product={item} />}
    />
  </View>
);

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
