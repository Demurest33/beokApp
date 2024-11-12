import { StyleSheet, Text, View } from "react-native";
import { getUser } from "@/store/sharedPreferences";
import { useEffect } from "react";
import useUserStore from "@/store/userStore";
import { User, Role } from "@/types/User";
import { router } from "expo-router";

export default function HomeScreen() {
  const userStore = useUserStore();

  useEffect(() => {
    const getUserData = async () => {
      const user: User = await getUser();
      if (user !== null) {
        userStore.setUser(user);

        if (user.role === Role.ADMIN || user.role === Role.AXULIAR) {
          router.replace("/admin");
        }

        if (user.role === Role.CLIENTE) {
          router.replace("/(tabs)/");
        }
      }
    };

    getUserData();
  }, []);

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.titleContainer}>
        Bienvenido {userStore.user?.name ?? "Usuario"}{" "}
        {userStore.user?.role ?? ""}
      </Text>
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
});
