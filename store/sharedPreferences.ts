import { User } from "@/types/User";
import * as SecureStore from "expo-secure-store";

export const saveUser = async (user: User) => {
  try {
    await SecureStore.setItemAsync("userInfo", JSON.stringify(user));
  } catch (error) {
    console.error("Error guardando la información del usuario:", error);
  }
};

export const getUser = async () => {
  try {
    const userData = await SecureStore.getItemAsync("userInfo");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error obteniendo la información del usuario:", error);
  }
};

export const clearUserFromPreferences = async () => {
  try {
    await SecureStore.deleteItemAsync("userInfo");
  } catch (error) {
    console.error("Error eliminando la información del usuario:", error);
  }
};
