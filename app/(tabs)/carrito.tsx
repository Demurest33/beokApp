import {
  StyleSheet,
  Pressable,
  View,
  Text,
  TextInput,
  Platform,
  ScrollView,
} from "react-native";
import useCartStore from "@/store/cart";
import { useState, useEffect } from "react";
import { productWithOptions } from "@/types/Menu";
import CartProduct from "@/components/CartProduct";
import DateTimePicker from "@react-native-community/datetimepicker";
import RadioForm, {
  RadioButton,
  RadioButtonLabel,
  RadioButtonInput,
} from "react-native-simple-radio-button";
import { paymentType } from "@/store/cart";
import { Order, createOrder } from "@/services/orders";
import useUserStore from "@/store/userStore";
import { Ionicons } from "@expo/vector-icons";

export default function Carrito() {
  const cartStore = useCartStore();
  const userStore = useUserStore();

  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState<productWithOptions[]>([]);

  // setear la fecha y hora a 35 min despues de la hora actual en México
  const now = new Date();
  const utcOffset = now.getTimezoneOffset() * 60000; // Diferencia UTC en milisegundos
  const mexicoOffset = -6 * 60 * 60 * 1000; // UTC-6 (tiempo estándar de México)
  const mexicoTime = new Date(now.getTime() + utcOffset + mexicoOffset);
  mexicoTime.setMinutes(mexicoTime.getMinutes() + 35);

  const [pickUpDate, setPickUpDate] = useState(mexicoTime);
  const [show, setShow] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [pago, setPago] = useState(paymentType.efectivo);
  const [showTransferOption, setShowTransferOption] = useState(true);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [meesage, setMessage] = useState("");

  const radio_props = [
    { label: "Efectivo", value: paymentType.efectivo },
    { label: "Transferencia", value: paymentType.transferencia },
  ];

  useEffect(() => {
    setProducts(cartStore.products);
  }, [cartStore.products]);

  useEffect(() => {
    let total = 0;
    // tomar en cuenta las opcioenes seleccionadas con sus prices
    products.forEach((product) => {
      const price_withOptions = product.selectedOptionPrices.reduce(
        (acc, optionPrice) => {
          return acc + Number(optionPrice);
        },
        product.price
      );
      total += price_withOptions * product.quantity;
    });
    setTotal(total);
  }, [products]);

  useEffect(() => {
    // Ocultar transferencia si es lunes, viernes, sábado o domingo
    const dayOfWeek = mexicoTime.getDay();
    setShowTransferOption(
      !(dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0)
    );
  }, []);

  useEffect(() => {
    // setear la fecha y hora a 35 min despues de la hora actual en México
    // lo anterior se debe de hacer cada que el carrito se actualiza
    const now = new Date();
    const utcOffset = now.getTimezoneOffset() * 60000; // Diferencia UTC en milisegundos
    const mexicoOffset = -6 * 60 * 60 * 1000; // UTC-6 (tiempo estándar de México)
    const mexicoTime = new Date(now.getTime() + utcOffset + mexicoOffset);
    mexicoTime.setMinutes(mexicoTime.getMinutes() + 35);

    setPickUpDate(mexicoTime);
  }, [cartStore.products]);

  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || pickUpDate;

    // si se selcciona una fecha en domingo, alertar al usuario
    if (currentDate.getDay() === 0) {
      alert("No se aceptan pedidos los domingos");
      return;
    }

    setShow(Platform.OS === "ios");
    setPickUpDate(currentDate);
    setShowTime(Platform.OS === "ios");
  };

  const handleOrder = async () => {
    if (creatingOrder) {
      return;
    }

    if (!userStore.user) {
      alert("Debes iniciar sesión para realizar un pedido.");
      return;
    }

    if (!userStore.user.verified_at) {
      alert("Debes verificar tu número antes de realizar un pedido.");
      return;
    }

    //   Hora de cierre de la cafeteria 7pm -- Hasta esa hora se pueden recoger pedidos
    // Hora de cierre de cocina -- 5pm
    // Los pedidos se deben de hacer 30min antes de la hora de recogida
    // Un pedido no se puede hacer so la hora actual (no la de recogida) es mayor a 4:30 pm
    // La hora de regida no puede ser mayor a las 7pm
    // La fecha de recogida no puede ser un domingo (ya que no se trabaja)
    // La hora ni la fecha de recogida pueden ser un día ya pasado.

    const now = new Date();
    const utcOffset = now.getTimezoneOffset() * 60000; // Diferencia UTC en milisegundos
    const mexicoOffset = -6 * 60 * 60 * 1000; // UTC-6 (tiempo estándar de México)
    const mexicoTime = new Date(now.getTime() + utcOffset + mexicoOffset);

    const closingTime = new Date(pickUpDate);
    closingTime.setHours(19, 0, 0, 0); // 7:00 PM

    const kitchenClosingTime = new Date(pickUpDate);
    kitchenClosingTime.setHours(17, 0, 0, 0); // 5:00 PM

    const thirtyMinutesBeforePickup = new Date(pickUpDate);
    thirtyMinutesBeforePickup.setMinutes(
      thirtyMinutesBeforePickup.getMinutes() - 30
    );

    // Validación 1: La fecha de recogida no puede ser un día ya pasado
    if (pickUpDate < mexicoTime) {
      console.log(pickUpDate, mexicoTime);
      alert("La fecha y hora de recogida no pueden ser en el pasado.");
      return;
    }

    // Validación 2: No se aceptan pedidos los domingos
    if (pickUpDate.getDay() === 0) {
      alert("No se aceptan pedidos los domingos.");
      return;
    }

    // Validación 3: La hora actual en México no puede ser mayor a 4:30 PM
    // const cutoffTime = new Date(mexicoTime);
    // cutoffTime.setHours(16, 30, 0, 0); // 4:30 PM
    // if (mexicoTime > cutoffTime) {
    //   alert("No se pueden realizar pedidos después de las 4:30 PM.");
    //   return;
    // }

    // Validación 4: La hora de recogida no puede ser mayor a las 7 PM
    // if (pickUpDate > closingTime) {
    //   alert("La hora de recogida no puede ser después de las 7:00 PM.");
    //   return;
    // }

    // Validación 6: Los pedidos deben realizarse con al menos 30 minutos de anticipación
    if (mexicoTime > thirtyMinutesBeforePickup) {
      alert(
        "Debes realizar tu pedido con al menos 30 minutos de anticipación para que la cocina tenga tiempo de prepararlo."
      );
      return;
    }

    // Validación 7: No se aceptan transferencias los viernes ni fines de semana
    const dayOfWeek = pickUpDate.getDay(); // 0 = Domingo, 5 = Viernes, 6 = Sábado
    if (
      pago === paymentType.transferencia &&
      (dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0)
    ) {
      alert("No se aceptan transferencias los viernes, sábados ni domingos.");
      return;
    }

    const productsWithCalculatedPrices = products.map((product) => ({
      ...product,
      totalPrice:
        product.price +
        product.selectedOptionPrices.reduce((sum, val) => sum + val, 0),
    }));

    const order: Order = {
      products: productsWithCalculatedPrices,
      total,
      additionalInstructions: meesage,
      pick_up_date:
        pickUpDate!.toLocaleDateString() +
        " " +
        pickUpDate!.toLocaleTimeString(),
      payment_type: pago,
    };

    try {
      setCreatingOrder(true);
      const response = await createOrder(order, parseInt(userStore.user.id));
      if (response) {
        alert("Orden creada con éxito");
        cartStore.clearCart();
      }
    } catch (error) {
      console.error("Error al crear la orden:", error);
      alert("Error al crear la orden");
    } finally {
      setCreatingOrder(false);
    }
  };

  if (products.length === 0) {
    return (
      <View style={styles.loginContainer}>
        <Ionicons name="cart-sharp" size={80} color="gray" />
        <Text style={styles.text}>Agrega productos a tu carrito</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Carrito </Text>
        <Ionicons name="cart-outline" style={styles.cartIcon} />
        <Text
          style={[styles.headerText, { marginLeft: 2, marginBottom: 2 }]}
        >{`(${products.length})`}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text style={styles.title}>Resumen del pedido</Text>
          <Pressable
            onPress={() => cartStore.clearCart()}
            style={{
              marginLeft: "auto",
              padding: 5,
              borderRadius: 5,
            }}
          >
            <Ionicons name="trash" size={24} color="red" />
          </Pressable>
        </View>

        <View
          style={{
            borderBottomColor: "gray",
            borderBottomWidth: 0.8,
          }}
        />

        {products.map((product) => (
          <CartProduct
            key={product.id + JSON.stringify(product.selectedOptions)}
            {...product}
          />
        ))}

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 8,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 6 }}>
            Total:
          </Text>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 6 }}>
            ${total}
          </Text>
        </View>

        <TextInput
          style={{
            height: 40,
            borderColor: "gray",
            borderWidth: 1,
            padding: 10,
            borderRadius: 5,
            marginVertical: 10,
          }}
          placeholder="Instrucciones adicionales"
          onChangeText={(text) => setMessage(text)}
          // multiline
          // numberOfLines={4}
        />

        {/* Hora y fecha de entrega */}

        <Text style={{ ...styles.title, marginBottom: 0 }}>
          Fecha de entrega
        </Text>
        <Text style={{ color: "gray" }}>
          La hora de entrega debe ser al menos 30 minutos después de la hora de
          pedido.
        </Text>

        <View style={styles.dateInputs}>
          <Pressable onPress={() => setShow(true)} style={styles.icon}>
            <Ionicons name="calendar-outline" size={40} color="black" />
            <Text style={{ marginLeft: 8 }}>
              {pickUpDate.toLocaleDateString()}
            </Text>
          </Pressable>

          <Pressable onPress={() => setShowTime(true)} style={styles.icon}>
            <Ionicons name="time-outline" size={40} color="black" />
            <Text style={{ marginLeft: 8 }}>
              {pickUpDate.toLocaleTimeString()}
            </Text>
          </Pressable>
        </View>

        {show && (
          <DateTimePicker
            value={pickUpDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onChange}
          />
        )}

        {showTime && (
          <DateTimePicker
            value={pickUpDate}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onChange}
          />
        )}

        <Text style={{ ...styles.title, marginBottom: 0 }}>Tipo de pago</Text>
        <Text style={{ color: "gray" }}>
          Los días viernes y sábados no se aceptan transferencias.
        </Text>

        <RadioForm
          formHorizontal={true}
          animation={true}
          style={{
            marginTop: 8,
            display: "flex",
            flexDirection: "row",
            flex: 1,
            justifyContent: "space-evenly",
          }}
        >
          {radio_props.map((obj, i) => (
            <RadioButton labelHorizontal={true} key={i}>
              <RadioButtonInput
                obj={obj}
                index={i}
                isSelected={pago === obj.value}
                onPress={() => setPago(obj.value)}
                buttonSize={16}
                buttonOuterSize={24}
                buttonInnerColor={"green"}
                buttonOuterColor={pago === obj.value ? "green" : "gray"}
              />
              <RadioButtonLabel
                obj={obj}
                index={i}
                labelStyle={{ fontSize: 16, marginRight: 8 }}
                labelHorizontal={true}
                onPress={() => setPago(obj.value)}
              />
            </RadioButton>
          ))}
        </RadioForm>

        <Pressable onPress={handleOrder} style={styles.button}>
          <Text style={styles.buttonText}>Enviar orden</Text>
        </Pressable>
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#3D9D3D",
    display: "flex",
    flexDirection: "row",
    marginVertical: 10,
    justifyContent: "center",
    paddingVertical: 4,
    alignItems: "center",
  },
  headerText: {
    color: "white",
    fontSize: 24,
  },
  cartIcon: {
    color: "white",
    fontSize: 30,
  },
  container: {
    marginHorizontal: 16,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    borderRadius: 10,
    borderColor: "gray",
    borderWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  icon: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  dateInputs: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 10,
  },
  loginContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    padding: 16,
    maxWidth: 200,
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
});
