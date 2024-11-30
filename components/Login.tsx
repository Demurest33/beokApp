import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { loginUser } from "@/services/auth";
import useUserStore from "@/store/userStore";
import { Role, User } from "@/types/User";
import { saveUser } from "@/store/sharedPreferences";

export default function LoginScreen() {
  const [phone, setphone] = useState("");
  const [password, setPassword] = useState("");
  const userStore = useUserStore();
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (loading) {
      return;
    }

    if (phone === "" || password === "") {
      alert("Todos los campos son requeridos");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;

    if (!phoneRegex.test(phone)) {
      alert("El número de teléfono no valido");
      return;
    }

    try {
      setLoading(true);
      const response: User = await loginUser({ phone, password });
      userStore.setUser(response);
      saveUser(response);

      if (response?.verified_at == null) {
        router.push("/smsVerification");
        return;
      }

      if (response.role === Role.ADMIN || response.role === Role.AXULIAR) {
        router.replace("/admin");
      }

      if (response.role === Role.CLIENTE) {
        router.replace("/(tabs)/");
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Incia sesión con tu número</Text>

      {loading ? <ActivityIndicator size="large" color="#000" /> : null}

      <TextInput
        style={styles.input}
        placeholder="Teléfono (WhatsApp)"
        keyboardType="phone-pad"
        accessibilityHint="phone"
        onChangeText={setphone}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        onChangeText={setPassword}
        secureTextEntry={true}
        accessibilityHint="password"
      />

      {/* replace   |   asChild*/}
      <Pressable style={styles.button} onPress={handleLogin}>
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          Iniciar Sesión
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#534E4E",
    marginBottom: 16,
  },
  stepContainer: {
    display: "flex",
    height: "70%",
    flexDirection: "column",
    gap: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: "center",
    marginBottom: 16,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#3D9D3D",
    minWidth: 300,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    borderColor: "#3D9D3D",
    borderWidth: 1,
    elevation: 5,
  },
  input: {
    borderColor: "gray",
    borderWidth: 1,
    width: "100%",
    maxWidth: 300,
    borderRadius: 5,
    textAlign: "center",
    padding: 10,
    fontSize: 22,
    backgroundColor: "#FBFBFB",
    elevation: 1,
    fontWeight: "bold",
  },
});
