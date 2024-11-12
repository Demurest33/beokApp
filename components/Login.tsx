import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
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

  async function handleLogin() {
    try {
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
    }
  }

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.titleContainer}>Login</Text>

      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        placeholder="Número celular"
        onChangeText={setphone}
      />

      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        placeholder="Password"
        onChangeText={setPassword}
      />

      {/* replace   |   asChild*/}
      <Pressable style={styles.button} onPress={handleLogin}>
        <Text
          style={{
            color: "white",
            textAlign: "center",
          }}
        >
          Login
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
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
