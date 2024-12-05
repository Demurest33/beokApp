import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Linking,
  Alert,
} from "react-native";
import QrCode from "../components/QrCode";
import { router } from "expo-router";
import { paymentType } from "@/store/cart";
import { LinearGradient } from "expo-linear-gradient";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams } from "expo-router";

// interface props {
//   hash: string;
//   tipo: string;
//   total: number;
// }

export default function () {
  const { tipo, hash, total } = useLocalSearchParams();

  const numero_cuenta = "4189 1431 1738 8119";
  const banco = "Banorte";
  const whatsapp = "2291204831";

  const enviarComprobante = () => {
    const url = `whatsapp://send?phone=${whatsapp}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert(
            "No se puede abrir WhatsApp",
            "Puede que no tenga WhatsApp instalado en su dispositivo"
          );
        }
      })
      .catch((err) => console.error("Error al abrir WhatsApp", err));
  };

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(numero_cuenta);
  };

  return (
    <LinearGradient colors={["#fff", "#3D9D3D"]} style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.header}>
          <Image
            source={require("../assets/images/banner.png")}
            style={styles.image}
          />

          <Text style={styles.title}>Pedido realizado</Text>
        </View>
        <View style={{ marginVertical: 4 }}>
          <QrCode pedidoId={hash.toString()} />

          {tipo == paymentType.efectivo && (
            <Text style={styles.subtext}>
              Presenta este QR en mostador y realiza tu pago por{" "}
              <Text style={{ fontWeight: "bold" }}>${total}</Text> para que te
              entregen tus alimentos.
            </Text>
          )}

          {tipo == paymentType.transferencia && (
            <>
              <Text style={styles.subtext}>
                Realiza tu transferencia por{" "}
                <Text style={{ fontWeight: "bold" }}>${total}</Text> para que te
                entreguen tus alimentos.
              </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  gap: 4,
                  marginTop: 8,
                }}
              >
                <Text
                  style={{
                    ...styles.subtext,
                    marginTop: 4,
                    color: "#FF0000",
                    fontWeight: "bold",
                  }}
                >
                  {banco}
                </Text>
                <Pressable onPress={copyToClipboard}>
                  <Text
                    style={{
                      ...styles.subtext,
                      marginTop: 4,
                      fontWeight: "bold",
                      textDecorationStyle: "solid",
                      textDecorationLine: "underline",
                    }}
                  >
                    {numero_cuenta}
                  </Text>
                </Pressable>
              </View>
            </>
          )}
        </View>

        <View style={styles.buttonsContainer}>
          <Pressable
            style={styles.btnOutlined}
            onPress={() => router.push("/(tabs)/pedidos")}
          >
            <Text style={styles.btnTextOutlined}>Ver pedidos</Text>
          </Pressable>

          {tipo == paymentType.transferencia && (
            <Pressable style={styles.button} onPress={enviarComprobante}>
              <Text style={styles.buttonText}>Enviar comprobante</Text>
            </Pressable>
          )}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  innerContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    margin: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    alignItems: "center",
    flex: 1,
    justifyContent: "space-around",
  },
  button: {
    backgroundColor: "#3D9D3D",
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  image: {
    height: 60,
    width: 86,
    borderRadius: 8,
  },
  subtext: {
    fontSize: 20,
    textAlign: "center",
  },
  header: {
    alignItems: "center",
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  btnOutlined: {
    borderColor: "#3D9D3D",
    borderWidth: 1,
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  btnTextOutlined: {
    color: "#3D9D3D",
    fontSize: 18,
    fontWeight: "bold",
  },
});
