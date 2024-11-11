import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import useUserStore from "@/store/userStore";
import { useEffect, useState } from "react";
import { User } from "@/types/User";

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const userStore = useUserStore();

  useEffect(() => {
    setUser(userStore.user ? userStore.user : null);
  }, []);

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.titleContainer}>Profile</Text>

      {user ? (
        <Link replace href="/login" asChild>
          <Text>Cerrar sesión</Text>
        </Link>
      ) : (
        <Link href="/login">
          <Text>No tienes sesión iniciada, inicia sesión</Text>
        </Link>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
});
