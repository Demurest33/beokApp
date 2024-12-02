import { Pressable, Text, StyleSheet, Linking, Alert } from "react-native";

const openWhatsApp = (phone: string) => {
  const url = `whatsapp://send?phone=${phone}`;
  Linking.canOpenURL(url)
    .then((supported) => {
      if (supported) {
        return Linking.openURL(url);
      } else {
        Alert.alert("Error", "No se puede abrir WhatsApp");
      }
    })
    .catch((err) => console.error("Error al abrir WhatsApp", err));
};

export default function WhatsappLink({ phone }: { phone: string }) {
  return (
    <Pressable onPress={() => openWhatsApp(phone)}>
      <Text style={{ color: "blue", fontSize: 18 }}>{phone}</Text>
    </Pressable>
  );
}
