import { View, Text, FlatList, StyleSheet } from "react-native";
import { Category, Product } from "@/types/Menu";
import ProductComponent from "./Product";

export default function CategoryComponent({
  category,
}: {
  category: Category;
}) {
  return (
    <View style={styles.category}>
      <Text style={styles.categoryName}>{category.name}</Text>
      <FlatList
        data={category.products}
        keyExtractor={(product: Product) => product.id.toString()}
        renderItem={({ item }) => <ProductComponent product={item} />}
      />
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
