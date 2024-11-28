import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

export default function MyPicker({ orderID }: { orderID: number }) {
  const [status, setStatus] = useState<string>("Preparando");
  const [modalVisible, setModalVisible] = useState(false);

  const pickeroptions = [
    { label: "Preparando", value: "Preparando", color: "#FFBF00" },
    { label: "Listo", value: "Listo", color: "#32CD32" },
    { label: "Entregado", value: "Entregado", color: "#1E90FF" },
    { label: "Cancelado", value: "Cancelado", color: "#FF6347" },
  ];

  const handleStatusChange = (itemValue: string) => {
    setStatus(itemValue);
    setModalVisible(false); // Cerrar el modal al seleccionar un estado
    Alert.alert(`El estado del pedido se ha cambiado a: ${itemValue}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cambiar estado del pedido</Text>
      <Text style={styles.subtitle}>Estado actual: {status}</Text>

      {/* Botón para abrir el modal de selección de estado */}
      <Button
        title="Seleccionar estado"
        onPress={() => setModalVisible(true)}
      />

      {/* Modal que contiene el FlatList */}
      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalBackground}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>
                  Selecciona el nuevo estado
                </Text>
                <FlatList
                  data={pickeroptions}
                  keyExtractor={(item) => item.value}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[styles.option, { borderLeftColor: item.color }]}
                      onPress={() => handleStatusChange(item.value)}
                    >
                      <Text style={styles.optionText}>{item.label}</Text>
                    </TouchableOpacity>
                  )}
                />
                <Button title="Cerrar" onPress={() => setModalVisible(false)} />
              </View>
            </TouchableWithoutFeedback>
          </View>
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
  },
  optionText: {
    fontSize: 16,
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
});
