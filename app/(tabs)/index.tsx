import { Image, StyleSheet, Platform, Text, View } from "react-native";
import { useEffect, useState } from "react";
import useUserStore from "@/store/userStore";

export default function HomeScreen() {
  // const userStore = useUserStore();
  // const [user, setUser] = useState(userStore.user);

  // useEffect(() => {
  //   setUser(userStore.user ? userStore.user : null);

  //   user ? alert("Bienvenido " + user?.name) : alert("Inicia sesión");
  // }, [user]);

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.titleContainer}>wea</Text>
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
