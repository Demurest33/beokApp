import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ScrollView,
  Modal,
} from "react-native";
import { useLocalSearchParams, Link } from "expo-router";
import { useEffect, useState } from "react";
import { ProductOption, productWithOptions } from "@/types/Menu";
import { getProductOptions } from "@/services/menu";
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from "react-native-simple-radio-button";
import useCartStore from "@/store/cart";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

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
  const [showModal, setShowModal] = useState(false);

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

    //añadir modal de ir al carrito o seguir comprando
    setShowModal(true);
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
      <View style={styles.header}>
        <Text style={styles.headerText}>{name}</Text>
      </View>

      <Image source={{ uri: image_url as string }} style={styles.image} />

      <View style={{ padding: 10, marginTop: 10 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={styles.price}>${priceTotal}</Text>

          <View style={styles.actions}>
            <Text style={{ fontSize: 20, fontWeight: "500", marginRight: 8 }}>
              Cantidad: {quantity}
            </Text>

            <Pressable
              onPress={() => addQuantity()}
              style={{ ...styles.outlineButon, borderColor: "green" }}
            >
              <Ionicons name="add" size={18} color="green" />
            </Pressable>
            <Pressable
              onPress={() => {
                if (quantity > 1) substractQuantity();
              }}
              style={{ ...styles.outlineButon, borderColor: "red" }}
            >
              <Ionicons name="remove" size={18} color="red" />
            </Pressable>
          </View>
        </View>

        <Text style={styles.description}>{description}</Text>

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
                    labelStyle={{ fontSize: 16 }}
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

        <Modal
          visible={showModal}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              {/* Mensaje */}
              <Text style={styles.modalMessage}>
                ¿Estás seguro de realizar esta acción?
              </Text>

              {/* Botones */}
              <View style={styles.buttonContainer}>
                <Pressable
                  style={[styles.button, { backgroundColor: "gray" }]}
                  onPress={() => {
                    setShowModal(false), router.replace("/(tabs)/");
                  }}
                >
                  <Text style={styles.buttonText}>Seguir comprando</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, { backgroundColor: "green" }]}
                  onPress={() => {
                    setShowModal(false);
                    router.replace("/(tabs)/carrito");
                  }}
                >
                  <Text style={styles.buttonText}>Ir al carrito</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        <Pressable onPress={getProductAndAttachoptions} style={styles.button}>
          <Text style={styles.buttonText}>Agregar al carrito</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  description: {
    fontSize: 18,
    color: "gray",
    marginVertical: 5,
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    textDecorationStyle: "solid",
    textDecorationLine: "underline",
  },
  option: {
    marginTop: 10,
  },
  optionName: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
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
    flexWrap: "wrap",
    gap: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#D4D4D4",
    borderBottomWidth: 3,
    borderBottomColor: "#ccc",

    elevation: 10,
    marginVertical: 10,
  },
  headerText: {
    color: "black",
    fontSize: 24,
    fontWeight: "600",
  },
  headerIcon: {
    color: "white",
    fontSize: 30,
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
  button: {
    backgroundColor: "#3D9D3D",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 10,
  },
  modalMessage: {
    fontSize: 20,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
