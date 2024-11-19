import {
  StyleSheet,
  Image,
  Pressable,
  View,
  Text,
  TextInput,
  Platform,
  Button,
} from "react-native";
import useCartStore from "@/store/cart";
import { useState, useEffect } from "react";
import { productWithOptions } from "@/types/Menu";
import CartProduct from "@/components/CartProduct";
import DateTimePicker from "@react-native-community/datetimepicker";
import RadioForm from "react-native-simple-radio-button";
import { paymentType } from "@/store/cart";
import { Order, createOrder } from "@/services/orders";
import useUserStore from "@/store/userStore";
import { User } from "@/types/User";

export default function Carrito() {
  const cartStore = useCartStore();
  const userStore = useUserStore();

  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState<productWithOptions[]>([]);

  // setear la fecha y hora a 35 min despues de la hora actual Y ajustar 30 minutos mas
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

  useEffect(() => {
    // Ocultar transferencia si es lunes, viernes, sábado o domingo
    const dayOfWeek = mexicoTime.getDay();
    setShowTransferOption(
      !(dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0)
    );
  }, []);

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
    //si el usuario no tiene sesion iniciad no puede hacer un pedido
    if (!userStore.user) {
      alert("Debes iniciar sesión para realizar un pedido.");
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

    const order: Order = {
      products,
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
      <View>
        <Text>No hay productos en el carrito</Text>
      </View>
    );
  }

  return (
    <View style={styles.titleContainer}>
      <Text>Total: ${total}</Text>

      {products.map((product) => (
        <CartProduct
          key={product.id + JSON.stringify(product.selectedOptions)}
          {...product}
        />
      ))}

      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        placeholder="Instrucciones adicionales"
        onChangeText={(text) => setMessage(text)}
        multiline
        numberOfLines={4}
      />

      {/* Hora y fecha de entrega */}

      <Text>
        Fecha seleccionada: {pickUpDate.toLocaleDateString()} -{" "}
        {pickUpDate.toLocaleTimeString()}
      </Text>

      <Pressable onPress={() => setShow(true)}>
        <Text>Seleccionar fecha</Text>
      </Pressable>

      <Pressable onPress={() => setShowTime(true)}>
        <Text>Seleccionar hora</Text>
      </Pressable>

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

      <Text>Tipo de pago:</Text>
      <RadioForm
        style={{ flexDirection: "row", gap: 10 }}
        radio_props={[
          { label: "Efectivo", value: paymentType.efectivo },
          ...(showTransferOption
            ? [{ label: "Transferencia", value: paymentType.transferencia }]
            : []),
        ]}
        initial={0}
        onPress={(value) => {
          setPago(value);
        }}
      />

      <Pressable onPress={handleOrder}>
        <Text>Enviar orden</Text>
      </Pressable>
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
