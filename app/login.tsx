import { View, Text, StyleSheet, Image } from "react-native";
import { Link } from "expo-router";
import LoginScreen from "@/components/Login";
import useUserStore from "@/store/userStore";
import { useEffect, useState } from "react";
import { User } from "@/types/User";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  const [user, setUser] = useState<User | null>(null);

  const userStore = useUserStore();

  useEffect(() => {
    userStore.clearUser();
  }, []);

  return (
    <View style={styles.stepContainer}>
      <LoginScreen />

      <View style={styles.links}>
        <Link href={"/register"} style={styles.button}>
          <Ionicons name="person-add-outline" size={20} color="#3D9D3D" />

          <Text> Registro</Text>
        </Link>

        <Link href={"/(tabs)/"} replace style={styles.button}>
          <Ionicons
            name="fast-food-outline"
            size={20}
            color="#3D9D3D"
            style={{ marginRight: 14 }}
          />
          <Text> Ver el menú</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
    justifyContent: "space-evenly",
    backgroundColor: "#fff",
  },
  register: {
    color: "blue",
    textAlign: "center",
  },
  links: {
    flex: 2,
    flexDirection: "row",
    maxWidth: "100%",
    justifyContent: "space-around",
  },
  button: {
    padding: 10,
    borderRadius: 5,
    color: "#3D9D3D",
    minWidth: 100,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    borderColor: "#3D9D3D",
    borderWidth: 1,

    maxHeight: 50,
  },
});
