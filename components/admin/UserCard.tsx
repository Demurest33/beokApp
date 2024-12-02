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
import { User, Role } from "@/types/User";
import { updateRole } from "@/services/users";
import WhatsappLink from "../WhatsappLink";

interface UserCardProps {
  user: User;
  fetchUsers: () => void;
}

export default function UserCard({ user, fetchUsers }: UserCardProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>(user.role);

  const changeRole = async (newRole: Role) => {
    try {
      const res = await updateRole(user.id, newRole);
      setSelectedRole(newRole);
      setModalVisible(false);

      if (res instanceof Error) {
        Alert.alert("Error", res.message);
      } else {
        fetchUsers();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <View style={styles.user}>
        <View style={{ flexDirection: "column" }}>
          <Text style={styles.userText}>
            {user.name} {user.lastname}
          </Text>

          <WhatsappLink phone={user.phone} />
        </View>

        {/* Pressable para abrir el modal */}
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
            {user.role}
          </Text>
        </Pressable>
      </View>

      {/* Modal para cambiar el rol */}
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
});
