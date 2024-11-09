import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { Link } from "expo-router";
import { useState } from "react";
import { router } from "expo-router";

export default function LoginScreen() {
  const [Username, setUsername] = useState("");

  function login() {
    if (Username === "") {
      alert("Please enter a username.");
      return;
    }

    Username == "admin" ? router.replace("/admin") : router.replace("/(tabs)/");
  }

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.titleContainer}>Login</Text>

      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        placeholder="Username"
        onChangeText={setUsername}
      />

      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        placeholder="Password"
      />

      {/* replace   |   asChild*/}
      <Pressable style={styles.button} onPress={login}>
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
