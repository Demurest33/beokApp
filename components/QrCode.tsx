import React from "react";
import { View, Text, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useEffect, useState } from "react";

interface props {
  pedidoId: string;
}

export default function QrCode(props: props) {
  const [qrData, setQrData] = useState<string | null>(null);

  useEffect(() => {
    setQrData(props.pedidoId);
  }, []);

  if (!qrData) {
    return <Text>Generando QR...</Text>;
  }

  return (
    <View style={styles.container}>
      <QRCode value={qrData} size={200} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
});
