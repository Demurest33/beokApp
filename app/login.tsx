import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { router } from "expo-router";
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
        <Pressable
          onPress={() => {
            router.push("/register");
          }}
          style={styles.button}
        >
          <Ionicons
            name="person-add-outline"
            size={20}
            color="#3D9D3D"
            style={{ marginRight: 4 }}
          />

          <Text style={styles.buttonText}>Registro</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            router.push("/(tabs)/");
          }}
          style={styles.button}
        >
          <Ionicons
            name="fast-food-outline"
            size={20}
            color="#3D9D3D"
            style={{ marginRight: 4 }}
          />
          <Text style={styles.buttonText}>Ver el menú</Text>
        </Pressable>
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
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    color: "#3D9D3D",
    fontSize: 16,
    fontWeight: "bold",
  },
});
