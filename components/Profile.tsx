import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Image,
  TextInput,
} from "react-native";
import useUserStore from "@/store/userStore";
import { Ionicons } from "@expo/vector-icons";
import { router, Link } from "expo-router";

export default function ProfileComponent() {
  const userStore = useUserStore();

  const goLogin = () => {
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      {/* banner image */}
      <Image
        style={styles.banner}
        source={require("../assets/images/profile_banner.png")}
      />

      {/* user info */}
      <View
        style={{
          padding: 16,
          gap: 8,
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Text style={styles.label}>{"Nombre(s)"}</Text>
        <TextInput
          editable={false}
          value={userStore.user?.name}
          aria-disabled
          style={styles.input}
        />

        <Text style={styles.label}>{"Apellido(s)"}</Text>
        <TextInput
          editable={false}
          value={userStore.user?.lastname}
          aria-disabled
          style={styles.input}
        />

        <Text style={styles.label}>{"Teléfono"}</Text>
        <TextInput
          editable={false}
          value={userStore.user?.phone}
          aria-disabled
          style={styles.input}
        />
      </View>

      <Link href={"/(tabs)/"} style={styles.button}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.butonLabel}> Cerrar sesión</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  banner: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
    opacity: 1,
    backgroundColor: "black",
  },
  input: {
    borderColor: "gray",
    borderWidth: 1,
    // width: "100%",
    // maxWidth: 300,
    borderRadius: 5,
    textAlign: "center",
    padding: 10,
    fontSize: 20,
    backgroundColor: "#FBFBFB",
    elevation: 1,
    fontWeight: "bold",
  },
  label: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#595757",
    textAlign: "center",
    marginBottom: 5,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    color: "#fff",
    maxWidth: 300,
    backgroundColor: "#3D9D3D",
    textAlign: "center",
    borderColor: "#3D9D3D",
    borderWidth: 1,
    maxHeight: 50,
    margin: "auto",
  },
  butonLabel: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
});
