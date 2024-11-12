import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Linking,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import { User, Role } from "@/types/User";

export default function UserCard(user: User) {
  const openWhatsApp = (phone: string) => {
    const url = `whatsapp://send?phone=${phone}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert("Error", "No se puede abrir WhatsApp");
        }
      })
      .catch((err) => console.error("Error al abrir WhatsApp", err));
  };

  return (
    <View style={styles.user}>
      <Text style={styles.userText}>{user.name}</Text>

      <Pressable onPress={() => openWhatsApp(user.phone)}>
        <Text style={[styles.userText, { color: "blue" }]}>{user.phone}</Text>
      </Pressable>

      <Text style={styles.userText}>{user.role}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  user: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  userText: {
    fontSize: 18,
  },
});
