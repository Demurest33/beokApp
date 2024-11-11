import { View, Text, StyleSheet, Image } from "react-native";
import { Link } from "expo-router";
import LoginScreen from "@/components/Login";
import useUserStore from "@/store/userStore";
import { useEffect, useState } from "react";
import { User } from "@/types/User";

export default function HomeScreen() {
  const [user, setUser] = useState<User | null>(null);

  const userStore = useUserStore();

  useEffect(() => {
    userStore.clearUser();
    setUser(userStore.user);
  }, []);

  return (
    <View style={styles.stepContainer}>
      <LoginScreen />

      <Link href={"/register"}>
        <Text style={styles.register}>Register</Text>
      </Link>
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
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  register: {
    color: "blue",
    textAlign: "center",
  },
});
