import { router } from "expo-router";
import { View, Text, StyleSheet, Pressable } from "react-native";

export default function GoClient() {
  function goClient() {
    router.push("/(tabs)/");
  }

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.titleContainer}>Ir al lado del cliente</Text>
      <Pressable style={styles.button} onPress={goClient}>
        <Text>Ir al lado del cliente</Text>
      </Pressable>
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
  button: {
    padding: 8,
    backgroundColor: "#7cc",
    borderRadius: 4,
  },
});
