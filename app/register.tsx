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
import { router } from "expo-router";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
      await registerUser({
        name,
        lastname: lastName,
        phone,
        password,
        password_confirmation: confirmPassword,
      });
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
        />

        <TextInput
          style={[styles.input, { flex: 1.5 }]}
          placeholder="Apellido(s)"
          onChangeText={setLastName}
        />
      </View>

      <TextInput
        style={[styles.input]}
        placeholder="Teléfono (WhatsApp)"
        onChangeText={setPhone}
      />

      <TextInput
        style={[styles.input]}
        placeholder="Contraseña"
        onChangeText={setPassword}
      />

      <TextInput
        style={[styles.input]}
        placeholder="Confirmar contraseña"
        onChangeText={setConfirmPassword}
      />

      {loading && <ActivityIndicator size="large" color="blue" />}

      {/* replace   |   asChild*/}
      <Pressable style={styles.button} onPress={handleRegister}>
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
