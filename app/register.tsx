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
          style={{
            flex: 1,
            height: 40,
            borderColor: "gray",
            borderWidth: 1,
            paddingLeft: 8,
            fontSize: 16,
          }}
          placeholder="Nombre(s)"
          onChangeText={setName}
        />

        <TextInput
          style={{
            flex: 1.5,
            height: 40,
            borderColor: "gray",
            borderWidth: 1,
            paddingLeft: 8,
            fontSize: 16,
          }}
          placeholder="Apellido(s)"
          onChangeText={setLastName}
        />
      </View>

      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          paddingLeft: 8,
          fontSize: 16,
        }}
        placeholder="Teléfono"
        onChangeText={setPhone}
      />

      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          paddingLeft: 8,
          fontSize: 16,
        }}
        placeholder="Contraseña"
        onChangeText={setPassword}
      />

      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          paddingLeft: 8,
          fontSize: 16,
        }}
        placeholder="Confirmar contraseña"
        onChangeText={setConfirmPassword}
      />

      {loading && <ActivityIndicator size="large" color="blue" />}

      {/* replace   |   asChild*/}
      <Pressable style={styles.button} onPress={handleRegister}>
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontSize: 16,
          }}
        >
          Registro
        </Text>
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
    gap: 8,
    padding: 16,
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
  },
});
