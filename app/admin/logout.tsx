import { Text, View, StyleSheet, Pressable } from "react-native";

export default function logout() {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.register}>Logout</Text>
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
