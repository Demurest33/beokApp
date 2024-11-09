import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Image, Platform, View, Text } from "react-native";

export default function TabTwoScreen() {
  return (
    <View style={styles.titleContainer}>
      <Text>Carrito de compras</Text>
      <Ionicons name="logo-react" size={40} style={styles.headerImage} />
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
    flexDirection: "row",
    gap: 8,
  },
});
