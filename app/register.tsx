import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { registerUser } from "@/services/auth";
import { sendPushNotification } from "@/services/pushNotifications"; // Importar la función
import { router } from "expo-router";
import { useNotification } from "@/context/NotificationContext";
import useUserStore from "@/store/userStore";
import { User } from "@/types/User";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { expoPushToken } = useNotification();
  const userStore = useUserStore();

  async function handleRegister() {
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    if (
      name === "" ||
      phone === "" ||
      password === "" ||
      confirmPassword === "" ||
      lastName === ""
    ) {
      alert("Por favor, llena todos los campos");
      return;
    }

    if (phone.length !== 10) {
      alert("El teléfono debe tener 10 dígitos");
      return;
    }

    if (password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      setLoading(true);

      // Registro del usuario
      const newUser: User = await registerUser({
        name,
        lastname: lastName,
        phone,
        password,
        password_confirmation: confirmPassword,
        pushToken: expoPushToken || "",
      });

      if (newUser) {
        userStore.setUser(newUser);
      } else {
        alert("Error al registrar el usuario");
        return;
      }

      if (expoPushToken) {
        await sendPushNotification(
          expoPushToken,
          "¡Bienvenido!",
          "Gracias por registrarte en nuestra app. Verifica tu número de teléfono para poder realizar pedidos."
        );
      }

      setName("");
      setLastName("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");

      // Navegar a la siguiente pantalla
      router.push("/smsVerification");
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.stepContainer}>
      <View style={styles.titleContainer}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Nombre(s)"
          onChangeText={setName}
          value={name}
        />

        <TextInput
          style={[styles.input, { flex: 1.5 }]}
          placeholder="Apellidos"
          onChangeText={setLastName}
          value={lastName}
        />
      </View>

      <TextInput
        style={[styles.input]}
        keyboardType="phone-pad"
        placeholder="Teléfono (WhatsApp)"
        onChangeText={setPhone}
        value={phone}
      />

      <TextInput
        style={[styles.input]}
        placeholder="Contraseña"
        secureTextEntry={true}
        onChangeText={setPassword}
        value={password}
      />

      <TextInput
        style={[styles.input]}
        placeholder="Confirmar contraseña"
        secureTextEntry={true}
        onChangeText={setConfirmPassword}
        value={confirmPassword}
      />

      <Pressable
        style={
          loading
            ? { ...styles.button, backgroundColor: "#83B683" }
            : styles.button
        }
        onPress={handleRegister}
      >
        {loading && <ActivityIndicator size="small" color="white" />}

        <Text style={styles.buttonText}>Registro</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
  },
  stepContainer: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
    gap: 8,
    padding: 16,
    flex: 1,
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
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    borderColor: "gray",
    borderWidth: 1,
    width: "100%",
    borderRadius: 5,
    textAlign: "center",
    padding: 10,
    fontSize: 22,
    backgroundColor: "#FBFBFB",
    elevation: 1,
    fontWeight: "bold",
  },
});
