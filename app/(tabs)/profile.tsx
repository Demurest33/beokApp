import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function ProfileScreen() {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.titleContainer}>Profile</Text>

      <Link replace href="/login" asChild>
        <Text>Cerrar sesión</Text>
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
});
