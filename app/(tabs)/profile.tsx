import { Text, View, StyleSheet, Pressable } from "react-native";
import { Link, router } from "expo-router";
import useUserStore from "@/store/userStore";
import { useEffect, useState } from "react";
import { User } from "@/types/User";
import { Ionicons } from "@expo/vector-icons";
import ProfileComponent from "@/components/Profile";

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const userStore = useUserStore();

  useEffect(() => {
    setUser(userStore.user ? userStore.user : null);
  }, []);

  const goLogin = () => {
    router.replace("/login");
  };

  return (
    <View style={styles.stepContainer}>
      {user ? (
        <ProfileComponent />
      ) : (
        <Pressable style={styles.loginContainer} onPress={goLogin}>
          <Ionicons name="person" size={80} color="gray" />
          <Text style={styles.text}>Incia sesión para hacer pedidos</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  stepContainer: {
    marginBottom: 8,
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
});
