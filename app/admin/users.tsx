import { View, Text, StyleSheet } from "react-native";

export default function UsersScreen() {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.titleContainer}>Usuarios</Text>
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
