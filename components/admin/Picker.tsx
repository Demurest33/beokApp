import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  FlatList,
  StyleSheet,
  Alert,
  TouchableWithoutFeedback,
  Pressable,
  TextInput,
} from "react-native";
import {
  OrderStatus,
  statusColors,
  updateOrderStatus,
} from "@/services/orders";
import { router } from "expo-router";

export default function MyPicker({ orderID }: { orderID: number }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [cancelationModalVisible, setCancelationModalVisible] = useState(false);
  const [cancelationReason, setCancelationReason] = useState<string>("");

  const pickeroptions = [
    {
      label: "Preparando",
      value: OrderStatus.preparando,
      color: statusColors[OrderStatus.preparando],
    },
    {
      label: "Listo",
      value: OrderStatus.listo,
      color: statusColors[OrderStatus.listo],
    },
    {
      label: "Entregado",
      value: OrderStatus.entregado,
      color: statusColors[OrderStatus.entregado],
    },
    {
      label: "Cancelado",
      value: OrderStatus.cancelado,
      color: statusColors[OrderStatus.cancelado],
    },
  ];

  const cancelOrder = async () => {
    try {
      await updateOrderStatus(
        orderID,
        OrderStatus.cancelado,
        cancelationReason
      );
      setModalVisible(false);
      Alert.alert("Éxito", "Pedido cancelado correctamente");
      router.replace("/admin/orders");
    } catch (error) {
      Alert.alert("Error", "No se pudo cancelar el pedido");
    } finally {
      setCancelationModalVisible(false);
      setCancelationReason("");
    }
  };

  const handleStatusChange = async (itemValue: OrderStatus) => {
    if (itemValue === OrderStatus.cancelado) {
      setCancelationModalVisible(true);
      setModalVisible(false);
      return;
    }

    try {
      await updateOrderStatus(orderID, itemValue);
      setModalVisible(false);

      Alert.alert("Éxito", "Estado del pedido actualizado correctamente");
      router.replace("/admin/orders");
    } catch (error) {
      Alert.alert("Error", "No se pudo cambiar el estado del pedido");
    }
  };

  return (
    <View style={styles.container}>
      {/* Botón para abrir el modal de selección de estado */}
      <Pressable
        style={styles.button}
        children={<Text style={styles.btnText}>Cambiar estado del pedido</Text>}
        onPress={() => setModalVisible(true)}
      />

      {/* Modal que contiene el FlatList */}
      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <Pressable
            style={styles.modalBackground}
            onPress={() => setModalVisible(false)}
          >
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                {/* <Text style={styles.modalTitle}>
                  Selecciona el nuevo estado
                </Text> */}
                <FlatList
                  style={{ width: "100%" }}
                  data={pickeroptions}
                  keyExtractor={(item) => item.value}
                  renderItem={({ item }) => (
                    <Pressable onPress={() => handleStatusChange(item.value)}>
                      <View
                        style={[styles.option, { borderLeftColor: item.color }]}
                      >
                        <Text style={styles.optionText}>{item.label}</Text>
                      </View>
                    </Pressable>
                  )}
                />
              </View>
            </TouchableWithoutFeedback>
          </Pressable>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal del mensaje de cancelación */}
      <Modal
        visible={cancelationModalVisible}
        animationType="fade"
        transparent={true}
      >
        <TouchableWithoutFeedback
          onPress={() => setCancelationModalVisible(false)}
        >
          <Pressable
            style={styles.modalBackground}
            onPress={() => setCancelationModalVisible(false)}
          >
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Motivo de cancelación</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Escribe el motivo de la cancelación"
                  onChangeText={setCancelationReason}
                />

                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <Pressable
                    style={[
                      styles.button,
                      {
                        marginRight: 10,
                        backgroundColor: "gray",
                        flex: 1,
                        maxWidth: 100,
                      },
                    ]}
                    onPress={() => setCancelationModalVisible(false)}
                  >
                    <Text style={styles.btnText}>Salir</Text>
                  </Pressable>

                  <Pressable
                    style={[
                      styles.button,
                      { backgroundColor: "#D32F2F", flex: 1, maxWidth: 100 },
                    ]}
                    onPress={() => {
                      cancelOrder();
                      setCancelationModalVisible(false);
                    }}
                  >
                    <Text style={styles.btnText}>Enviar</Text>
                  </Pressable>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Pressable>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "bold",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "100%",
    borderLeftWidth: 5,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderTopColor: "#ccc",
    borderRightColor: "#ccc",
    borderBottomColor: "#ccc",
  },
  optionText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#3D9D3D",
    padding: 10,
    borderRadius: 10,
    elevation: 2,
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  input: {
    width: "100%",
    maxWidth: 300,
    flexGrow: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
});
