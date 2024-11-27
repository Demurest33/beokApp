import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Pressable,
} from "react-native";
import {
  CameraView,
  CameraType,
  useCameraPermissions,
  BarcodeScanningResult,
} from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { decodeQr } from "@/services/orders";
import { decodeQrResponse } from "@/services/orders";
import Order from "@/components/admin/Order";

export default function QrScanner() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [order, setOrder] = useState<decodeQrResponse | null>(null);

  if (!permission) {
    // Permisos de la cámara aún se están cargando.
    return <View />;
  }

  if (!permission.granted) {
    // Aún no se han otorgado los permisos.
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={styles.message}>
          Necesitamos tu permiso para acceder a la cámara
        </Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.text}>Otorgar permisos</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  async function handleBarCodeScanned({ data }: BarcodeScanningResult) {
    if (scanned) {
      return;
    }

    setScanned(true);
    // Alert.alert("Código escaneado", `Contenido: ${data}`, [
    //   {
    //     text: "Cerrar",
    //   },
    // ]);
    const orderResponse: decodeQrResponse = await decodeQr(data);

    if (orderResponse) {
      setOrder(orderResponse);
      // Alert.alert("Pedido decodificado", `Pedido: ${orderResponse.order.id}`, [
      //   {
      //     text: "Cerrar",
      //   },
      // ]);
    }
  }

  if (order !== null) {
    // Componente para mostrar el pedido decodificado.

    return (
      <>
        <Pressable
          onPress={() => {
            setOrder(null);
            setScanned(false);
          }}
        >
          <Text style={styles.title}>Escanear QR del cliente</Text>
        </Pressable>

        <Order order={order!} />
      </>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={handleBarCodeScanned} // Solo escanea si no está marcado como "scanned".
      >
        <TouchableOpacity
          onPress={toggleCameraFacing}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            backgroundColor: "#3D9D3D",
            padding: 10,
            borderRadius: 14,
          }}
        >
          <Ionicons name="camera-reverse" size={24} color="white" />
        </TouchableOpacity>
      </CameraView>

      <TouchableOpacity
        onPress={() => setScanned(false)}
        style={[styles.button]}
      >
        <Text style={[styles.text]}>Escanear de nuevo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
    marginHorizontal: 20,
    fontSize: 20,
    fontWeight: "semibold",
  },
  camera: {
    flex: 1,
    width: "85%",
    maxHeight: "68%",
    marginBottom: "10%",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#3D9D3D",
    padding: 10,
    paddingHorizontal: 24,
    borderRadius: 14,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  title: {
    textAlign: "center",
    marginVertical: 10,
    fontSize: 24,
    fontWeight: "bold",
  },
});
