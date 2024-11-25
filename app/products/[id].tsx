import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, Link } from "expo-router";
import { useEffect, useState } from "react";
import { ProductOption, productWithOptions } from "@/types/Menu";
import { getProductOptions } from "@/services/menu";
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
  RadioButtonProps,
} from "react-native-simple-radio-button";
import useCartStore from "@/store/cart";

export default function ProductComponent() {
  const cartStore = useCartStore();
  const { id, name, description, price, image_url } = useLocalSearchParams();
  const [options, setOptions] = useState<ProductOption[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: any;
  }>({});
  const [loading, setLoading] = useState(true);
  const [priceTotal, setPriceTotal] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProductOptions();

    const price_withDefaultOptions =
      parseFloat(price as string) +
      options.reduce((acc, option) => {
        const valueIndex = option.values.indexOf(option.values[0]);
        const optionPrice = option.prices?.[valueIndex] || 0;
        return acc + Number(optionPrice);
      }, 0);

    setPriceTotal(price_withDefaultOptions);
  }, []);

  useEffect(() => {
    // primero calcular el precio total en base a las selected optiosn y depues calcular el precio total en base a la cantidad

    const price_withOptions = options.reduce((acc, option) => {
      const valueIndex = option.values.indexOf(selectedOptions[option.name]);
      const optionPrice = option.prices?.[valueIndex] || 0;
      return acc + Number(optionPrice);
    }, parseFloat(price as string));

    setPriceTotal(price_withOptions * quantity);
  }, [selectedOptions]);

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
      //set the price total
      setPriceTotal(parseFloat(price as string));
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
      quantity: quantity,
      selectedOptionPrices: options.map((option) => {
        const valueIndex = option.values.indexOf(selectedOptions[option.name]);
        return option.prices?.[valueIndex] || 0;
      }),
      totalPrice: priceTotal,
    };

    cartStore.addProduct(productWithOptions);
    alert("Producto agregado al carrito"); //dar la opcion de ir al carrito o seguir comprando
  }

  function addQuantity() {
    setQuantity(quantity + 1);

    //set the price total

    const price_withOptions = options.reduce((acc, option) => {
      const valueIndex = option.values.indexOf(selectedOptions[option.name]);
      const optionPrice = option.prices?.[valueIndex] || 0;
      return acc + Number(optionPrice);
    }, parseFloat(price as string));

    setPriceTotal(price_withOptions * (quantity + 1));
  }

  function substractQuantity() {
    if (quantity > 1) setQuantity(quantity - 1);

    //set the price total
    const price_withOptions = options.reduce((acc, option) => {
      const valueIndex = option.values.indexOf(selectedOptions[option.name]);
      const optionPrice = option.prices?.[valueIndex] || 0;
      return acc + Number(optionPrice);
    }, parseFloat(price as string));

    setPriceTotal(price_withOptions * (quantity - 1));
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: image_url as string }} style={styles.image} />
      <Text style={styles.productName}>{name}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.price}>${priceTotal}</Text>

      {/* make radio buttons */}

      {loading && <Text>Cargando opciones...</Text>}

      {options.map((option) => (
        <View key={option.id}>
          <Text style={styles.optionName}>{option.name}</Text>

          <RadioForm
            formHorizontal={option.values.length < 4}
            animation
            style={styles.radiobuttonform}
            // radio_props={ => ({
            //   label: value,
            //   value: value,
            // }))}
            accessibilityLabel="radio"
            initial={0}
            // onPress={(value) => {
            //   // console.log(option.prices?.[option.values.indexOf(value)] || 0);
            //   setSelectedOptions({
            //     ...selectedOptions,
            //     [option.name]: value,
            //   });
            // }}
          >
            {option.values.map((value) => (
              <RadioButton labelHorizontal key={value}>
                <RadioButtonInput
                  buttonInnerColor="green"
                  buttonOuterColor="green"
                  obj={{ label: value, value: value }}
                  index={option.values.indexOf(value)}
                  isSelected={selectedOptions[option.name] === value}
                  buttonSize={16}
                  buttonWrapStyle={{ marginRight: 6 }}
                  onPress={(value) => {
                    // console.log(option.prices?.[option.values.indexOf(value)] || 0);
                    setSelectedOptions({
                      ...selectedOptions,
                      [option.name]: value,
                    });
                  }}
                />
                <RadioButtonLabel
                  obj={{ label: value, value: value }}
                  index={option.values.indexOf(value)}
                  onPress={(value) => {
                    // console.log(option.prices?.[option.values.indexOf(value)] || 0);
                    setSelectedOptions({
                      ...selectedOptions,
                      [option.name]: value,
                    });
                  }}
                />
              </RadioButton>
            ))}
          </RadioForm>
        </View>
      ))}

      {/* cambiar cantidad del producto */}

      <Text>Cantidad: {quantity}</Text>
      <Pressable
        style={{ marginBottom: 10, backgroundColor: "red", padding: 10 }}
        onPress={() => {
          if (quantity > 1) substractQuantity();
        }}
      >
        <Text style={{ fontSize: 16, color: "white" }}>Restar uno mas</Text>
      </Pressable>

      <Pressable
        style={{ marginBottom: 10, backgroundColor: "blue", padding: 10 }}
        onPress={() => addQuantity()}
      >
        <Text style={{ fontSize: 16, color: "white" }}>Agregar uno mas</Text>
      </Pressable>

      <Pressable
        onPress={() => {
          getProductAndAttachoptions();
        }}
      >
        <Text>Añadir al carrito</Text>
      </Pressable>
    </ScrollView>
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
    resizeMode: "contain",
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
  radiobuttonformRow: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 10,
  },

  radiobuttonform: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
});
