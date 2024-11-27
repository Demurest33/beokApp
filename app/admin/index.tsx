import { View, Text, StyleSheet, Pressable } from "react-native";
import QrScanner from "@/components/admin/QrScanner";

export default function AdminHome() {
  return (
    <View style={styles.container}>
      <QrScanner />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Permite que el contenedor ocupe todo el espacio de la pantalla
  },
  title: {
    textAlign: "center",
    marginVertical: 10,
    fontSize: 24,
    fontWeight: "bold",
  },
});
