import { StyleSheet, Image, Pressable, View, Text } from "react-native";
import useCartStore from "@/store/cart";
import { useState, useEffect } from "react";
import { productWithOptions } from "@/types/Menu";
import CartProduct from "@/components/CartProduct";

export default function Carrito() {
  const cartStore = useCartStore();

  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState<productWithOptions[]>([]);

  useEffect(() => {
    setProducts(cartStore.products);
  }, [cartStore.products]);

  useEffect(() => {
    let total = 0;

    products.forEach((product) => {
      total += product.price * product.quantity;
    });
    setTotal(total);
  }, [products]);

  return (
    <View style={styles.titleContainer}>
      <Text>Total: ${total}</Text>

      {products.map((product) => (
        <CartProduct
          key={product.id + JSON.stringify(product.selectedOptions)}
          {...product}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "column",
    gap: 8,
  },
});
