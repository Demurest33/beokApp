import { productWithOptions, ProductOption } from "@/types/Menu";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import useCartStore from "@/store/cart";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function CartProduct(product: productWithOptions) {
  const cartStore = useCartStore();

  const {
    id,
    name,
    description,
    price,
    image_url,
    quantity,
    selectedOptionPrices,
    selectedOptions,
  } = product;

  const madeKey = id + JSON.stringify(product.selectedOptions);

  const [priceTotal, setPriceTotal] = useState(price);

  useEffect(() => {
    //calcular el precio total en base a las opciones seleccionadas
    const price_withOptions = selectedOptionPrices.reduce(
      (acc, optionPrice) => {
        return acc + Number(optionPrice);
      },
      price
    );

    setPriceTotal(price_withOptions * quantity);
  }, [quantity]);

  return (
    <>
      <View style={styles.container}>
        <Image source={{ uri: image_url }} style={styles.image} />
        <View style={{ marginLeft: 8 }}>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={[styles.text]}>
              {name} {`(${quantity})`}
            </Text>
            <Text style={styles.text}> ${priceTotal}</Text>
          </View>

          {product.selectedOptions &&
            Object.keys(product.selectedOptions).map((key) => (
              <View
                key={key + "view"}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginTop: 2,
                }}
              >
                <Text key={key + "llave"} style={{ fontWeight: "600" }}>
                  {key}: {` `}
                </Text>

                <Text key={key + "opcion"}>{product.selectedOptions[key]}</Text>
              </View>
            ))}
        </View>
      </View>

      <View style={styles.container}>
        <Pressable
          onPress={() => cartStore.removeProduct(product)}
          style={styles.outlineButon}
        >
          <Ionicons name="trash" size={18} color="black" />
          <Text>Eliminar</Text>
        </Pressable>
        <Pressable
          onPress={() => cartStore.addOneToProduct(product)}
          style={{ ...styles.outlineButon, borderColor: "green" }}
        >
          <Ionicons name="add" size={18} color="green" />
        </Pressable>
        <Pressable
          onPress={() => cartStore.substracOneToProduct(product)}
          style={{ ...styles.outlineButon, borderColor: "red" }}
        >
          <Ionicons name="remove" size={18} color="red" />
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    padding: 8,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
  outlineButon: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "black",
    marginRight: 8,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
});
