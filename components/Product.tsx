import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import { Product } from "@/types/Menu";
import { router } from "expo-router";

export default function ProductComponent({ product }: { product: Product }) {
  const handlePressProduct = () => {
    router.push({
      pathname: `/products/[id]`,
      params: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        image_url: product.image_url,
      },
    });
  };

  return (
    <View style={styles.product}>
      <Pressable onPress={handlePressProduct}>
        <Image source={{ uri: product.image_url }} style={styles.image} />
      </Pressable>
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.description}>{product.description}</Text>
      <Text style={styles.price}>${product.price}</Text>
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
