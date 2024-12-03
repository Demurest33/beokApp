import {
  View,
  StyleSheet,
  Text,
  Pressable,
  ImageBackground,
  TextInput,
} from "react-native";
import useUserStore from "@/store/userStore";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";

export default function ProfileComponent() {
  const userStore = useUserStore();

  return (
    <ImageBackground
      style={styles.container}
      source={require("../assets/images/profile_banner.png")}
      imageStyle={{ opacity: 0.8 }}
    >
      {/* Contenedor de la información */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>{"Nombre(s)"}</Text>
        <TextInput
          editable={false}
          value={userStore.user?.name}
          style={styles.input}
        />

        <Text style={styles.label}>{"Apellido(s)"}</Text>
        <TextInput
          editable={false}
          value={userStore.user?.lastname}
          style={styles.input}
        />

        <Text style={styles.label}>{"Teléfono"}</Text>
        <TextInput
          editable={false}
          value={userStore.user?.phone}
          style={styles.input}
        />

        <Pressable
          onPress={() => {
            router.push("/login");
          }}
          style={styles.button}
        >
          <Ionicons name="log-out-outline" size={22} color="#fff" />
          <Text style={styles.buttonLabel}> Cerrar sesión</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    maxWidth: 350,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  input: {
    borderColor: "#aaa",
    borderWidth: 1,
    borderRadius: 5,
    textAlign: "center",
    padding: 10,
    fontSize: 18,
    marginBottom: 10,
    backgroundColor: "#fff",
    fontWeight: "bold",
  },
  label: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  button: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 5,
    backgroundColor: "#3D9D3D",
    marginTop: 10,
  },
  buttonLabel: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 5,
  },
});
