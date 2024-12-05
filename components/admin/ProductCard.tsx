import {
  View,
  Text,
  Image,
  StyleSheet,
  Switch,
  ActivityIndicator,
} from "react-native";
import { Product } from "@/types/Menu";
import { toogleProductAvailability } from "@/services/menu";
import { useState } from "react";

export default function ProductCard({ product }: { product: Product }) {
  const [availability, setAvailability] = useState(product.available);
  const [loading, setLoading] = useState(false);

  const handleToggleAvailability = async () => {
    setLoading(true);
    const response = await toogleProductAvailability(product.id);

    if (response) {
      setAvailability(!availability);
    }

    setLoading(false);
  };

  return (
    <View style={styles.card}>
      <Image source={{ uri: product.image_url }} style={styles.image} />
      <Text style={styles.name} numberOfLines={1}>
        {product.name}
      </Text>

      {loading ? (
        <ActivityIndicator size="small" color="#000" />
      ) : (
        <Switch
          value={availability}
          onValueChange={handleToggleAvailability}
          trackColor={{ false: "#767577", true: "#68B168" }}
          thumbColor={availability ? "#3D9D3D" : "#A2B8A2"}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    // Shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 16,
    flex: 1, // Para ocupar el espacio restante
    flexWrap: "nowrap", // Evita que se divida en líneas adicionales
  },
});
