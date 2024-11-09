import { Link, Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />

      <View style={styles.container}>
        <Text>404 - Page Not Found</Text>
        <Link href="/_sitemap" style={styles.link} asChild>
          <Text>Go Home</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
