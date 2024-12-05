import { Text, View, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";
import useUserStore from "@/store/userStore";
import { useEffect, useState } from "react";
import { User } from "@/types/User";
import { Ionicons } from "@expo/vector-icons";
import ProfileComponent from "@/components/Profile";

export default function ProfileScreen() {
  const userStore = useUserStore();

  const goLogin = () => {
    router.push("/login");
  };

  return (
    <View style={styles.stepContainer}>
      {userStore.user ? (
        <ProfileComponent />
      ) : (
        <Pressable style={styles.loginContainer} onPress={goLogin}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              textAlign: "center",
              padding: 16,
              maxWidth: 250,
              color: "gray",
            }}
          >
            Inicia sesión para ver tu perfil
          </Text>
          <View style={styles.button}>
            <Ionicons name="log-in-sharp" size={32} color="white" />

            <Text style={styles.buttonText}>Iniciar sesión</Text>
          </View>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  loginContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    maxWidth: 200,
    textAlign: "center",
    padding: 16,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3D9D3D",
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    gap: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
