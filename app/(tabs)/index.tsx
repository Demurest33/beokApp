import { Image, StyleSheet, Platform, Text, View } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { api } from "@/services/api";

export default function HomeScreen() {
  useEffect(() => {
    api.get("/").then((response) => {
      console.log(response.data);
    });
  }, []);

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
