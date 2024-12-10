import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  Modal,
  TouchableOpacity,
} from "react-native";
import { UserWithOrderCounts, Role } from "@/types/User";
import { updateRole, toogleBanUser } from "@/services/users";
import WhatsappLink from "../WhatsappLink";
import { statusColors } from "@/services/orders";

interface UserCardProps {
  user: UserWithOrderCounts;
}

export default function StandaloneUserCard({ user }: UserCardProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>(user.role);
  const [selectedBan, setSelectedBan] = useState<boolean>(user.is_banned);

  const changeRole = async (newRole: Role) => {
    try {
      const res = await updateRole(user.id, newRole);
      if (res instanceof Error) {
        Alert.alert("Error", res.message);
        return;
      }
      setSelectedRole(newRole);
      setModalVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleBan = async () => {
    try {
      const res = await toogleBanUser(user.id);
      if (res instanceof Error) {
        Alert.alert("Error", res.message);
        return;
      }
      setSelectedBan(!selectedBan);
      setModalVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <View
        style={[
          styles.user,
          selectedBan && {
            backgroundColor: "#FFD6D6",
            opacity: 0.8,
          },
        ]}
      >
        <View style={{ flexDirection: "column" }}>
          <Text style={styles.userText}>
            {user.name} {user.lastname}
          </Text>

          <WhatsappLink phone={user.phone} />

          {/* Indicadores de estado de pedidos */}
          <View style={styles.orderStatusContainer}>
            <View style={styles.orderStatusRow}>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: statusColors.preparando },
                ]}
              />
              <Text style={styles.userText}>{user.preparing_orders_count}</Text>
            </View>
            <View style={styles.orderStatusRow}>
              <View
                style={[styles.dot, { backgroundColor: statusColors.listo }]}
              />
              <Text style={styles.userText}>{user.ready_orders_count}</Text>
            </View>
            <View style={styles.orderStatusRow}>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: statusColors.entregado },
                ]}
              />
              <Text style={styles.userText}>{user.delivered_orders_count}</Text>
            </View>
            <View style={styles.orderStatusRow}>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: statusColors.cancelado },
                ]}
              />
              <Text style={styles.userText}>{user.canceled_orders_count}</Text>
            </View>
          </View>
        </View>

        {/* Botón para abrir el modal */}
        <Pressable onPress={() => setModalVisible(true)}>
          <Text
            style={[
              {
                padding: 8,
                borderRadius: 10,
                backgroundColor: "green",
                color: "white",
              },
            ]}
          >
            {selectedRole}
          </Text>
        </Pressable>
      </View>

      {/* Modal para cambiar el rol y banear */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Cambiar Rol</Text>

            {/* Opciones de roles */}
            {["ADMIN", "CLIENTE", "AUXILIAR"].map((role) => (
              <TouchableOpacity
                key={role}
                style={[
                  styles.roleOption,
                  selectedRole === role && styles.selectedRoleOption,
                ]}
                onPress={() => changeRole(role as Role)}
              >
                <Text
                  style={[
                    styles.roleText,
                    selectedRole === role && styles.selectedRoleText,
                  ]}
                >
                  {role}
                </Text>
              </TouchableOpacity>
            ))}

            {/* Botón para banear */}
            <Text style={[styles.modalTitle, { marginBottom: 6 }]}>
              Banear usuario
            </Text>
            <TouchableOpacity
              style={
                selectedBan ? styles.outelineadBanUserBtn : styles.banUserBtn
              }
              onPress={toggleBan}
            >
              <Text
                style={
                  selectedBan
                    ? styles.unbanText
                    : { color: "white", fontWeight: "bold", fontSize: 18 }
                }
              >
                {selectedBan ? "Desbloquear" : "Bloquear"}
              </Text>
            </TouchableOpacity>

            {/* Botón para cerrar */}
            <Pressable
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Cancelar</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  user: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderWidth: 1,
    borderBottomColor: "gray",
    borderStyle: "solid",
    borderRadius: 8,
    marginBottom: 10,
  },
  userText: {
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  roleOption: {
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    backgroundColor: "#f0f0f0",
    width: "100%",
    alignItems: "center",
  },
  selectedRoleOption: {
    backgroundColor: "#3D9D3D",
  },
  roleText: {
    fontSize: 16,
    color: "#333",
  },
  selectedRoleText: {
    color: "#fff",
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#E53935",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  banUserBtn: {
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    backgroundColor: "#E53935",
    width: "100%",
    alignItems: "center",
  },
  outelineadBanUserBtn: {
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    backgroundColor: "#fff",
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E53935",
  },
  unbanUserBtn: {
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    backgroundColor: "#3D9D3D",
    width: "100%",
    alignItems: "center",
  },
  unbanText: {
    fontSize: 18,
    color: "red",
    fontWeight: "bold",
  },
  orderStatusContainer: {
    marginTop: 10,
    flexDirection: "row",
    gap: 12,
  },
  orderStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5, // Hace que el elemento sea circular
    marginRight: 8, // Espacio entre el punto y el texto
  },
});
