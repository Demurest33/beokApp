import { View, Text, Image, StyleSheet } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import useUserStore from "@/store/userStore";

export default function CustomDrawerContent(props: any) {
  const user = useUserStore((state) => state.user);
  return (
    <DrawerContentScrollView {...props}>
      {/* Banner personalizado */}
      <View style={styles.bannerContainer}>
        <Image
          //usar imagenes desde assets
          source={require("../../assets/images/banner.png")}
          style={styles.bannerImage}
        />
        <View>
          <Text style={styles.bannerText}>Bienvenido</Text>
          <Text style={styles.bannerText}>{user?.name}</Text>
        </View>
      </View>

      {/* Lista de elementos del drawer */}
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    display: "flex",
    flexDirection: "row",
    padding: 16,
    marginBottom: 8,
    backgroundColor: "#3D9D3D",
  },
  bannerImage: {
    width: 80,
    height: 60,
    marginBottom: 8,
    marginRight: 16,
  },
  bannerText: {
    color: "#fff",
    fontSize: 24,
  },
});
