import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { useLocalSearchParams, Link } from "expo-router";

export default function orderDetails() {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <Text>Order Details</Text>
      <Text>Order ID: {id}</Text>
    </View>
  );
}
