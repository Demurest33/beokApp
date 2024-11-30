import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function Header({
  navigation,
  canGoBack,
}: {
  navigation: any;
  canGoBack: boolean;
}) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View
        style={[
          styles.container,
          { justifyContent: canGoBack ? "space-between" : "center" },
        ]}
      >
        {canGoBack && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        )}
        <Image
          source={require("../assets/images/banner.png")}
          style={styles.image}
        />
        <View style={styles.placeholder} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#3D9D3D",
    color: "#fff",
  },
  container: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    backgroundColor: "#3D9D3D",
  },
  backButton: {
    marginRight: 10,
  },
  image: {
    width: 70,
    height: 50,
    resizeMode: "contain",
    marginLeft: 20,
  },
  placeholder: {
    width: 24, // Misma anchura que el icono para mantener la imagen centrada
  },
});
