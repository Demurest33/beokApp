import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { useLocalSearchParams, Link } from "expo-router";
import { useEffect, useState } from "react";
import { ProductOption, productWithOptions } from "@/types/Menu";
import { getProductOptions } from "@/services/menu";
import RadioForm from "react-native-simple-radio-button";
import useCartStore from "@/store/cart";

export default function ProductComponent() {
  const cartStore = useCartStore();
  const { id, name, description, price, image_url } = useLocalSearchParams();
  const [options, setOptions] = useState<ProductOption[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: any;
  }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductOptions();
  }, []);

  async function fetchProductOptions() {
    try {
      const options: ProductOption[] = await getProductOptions(
        parseInt(id as string)
      );
      setOptions(options);

      // Inicializamos las opciones seleccionadas con valores por defecto
      const initialSelectedOptions: { [key: string]: any } = {};
      options.forEach((option) => {
        initialSelectedOptions[option.name] = option.values[0];
      });
      setSelectedOptions(initialSelectedOptions);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function getProductAndAttachoptions() {
    const productWithOptions: productWithOptions = {
      id: parseInt(id as string),
      name: name as string,
      description: description as string,
      price: parseFloat(price as string),
      image_url: image_url as string,
      selectedOptions,
      quantity: 1,
    };

    cartStore.addProduct(productWithOptions);
    alert("Producto agregado al carrito"); //dar la opcion de ir al carrito o seguir comprando
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: image_url as string }} style={styles.image} />
      <Text style={styles.productName}>{name}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.price}>${price}</Text>

      {/* make radio buttons */}

      {options.map((option) => (
        <View key={option.id}>
          <Text style={styles.optionName}>{option.name}</Text>

          <RadioForm
            radio_props={option.values.map((value) => ({
              label: value,
              value: value,
            }))}
            initial={0}
            onPress={(value) => {
              setSelectedOptions({
                ...selectedOptions,
                [option.name]: value,
              });
            }}
          />
        </View>
      ))}

      <Pressable
        onPress={() => {
          getProductAndAttachoptions();
        }}
      >
        <Text>Añadir al carrito</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  category: {
    marginBottom: 20,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  product: {
    marginBottom: 15,
    alignItems: "center",
  },
  image: {
    width: 400,
    height: 200,
    borderRadius: 10,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  description: {
    fontSize: 18,
    color: "gray",
    marginTop: 5,
  },
  price: {
    fontSize: 18,
    color: "green",
    marginTop: 5,
  },
  option: {
    marginTop: 10,
  },
  optionName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  optionValue: {
    fontSize: 16,
  },
});
