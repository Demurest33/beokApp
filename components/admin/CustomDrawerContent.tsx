import { View, Text, Image, StyleSheet } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";

export default function CustomDrawerContent(props: any) {
  return (
    <DrawerContentScrollView {...props}>
      {/* Banner personalizado */}
      <View style={styles.bannerContainer}>
        <Image
          source={{ uri: "https://via.placeholder.com/300x150" }} // Usa una URL o una imagen local
          style={styles.bannerImage}
        />
        <Text style={styles.bannerText}>Bienvenido</Text>
      </View>

      {/* Lista de elementos del drawer */}
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: "#7cc",
    padding: 16,
    marginBottom: 8,
  },
  bannerImage: {
    width: 300,
    height: 150,
    marginBottom: 8,
  },
  bannerText: {
    color: "#fff",
    fontSize: 24,
  },
});
