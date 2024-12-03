import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import Constants from "expo-constants";

export async function registerForPushNotifications() {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      console.log("No se concedieron permisos para las notificaciones");
    }
    const projectID =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectID) {
      throw new Error("No se encontró el projectID");
    }
    try {
      const pushToken = (
        await Notifications.getExpoPushTokenAsync({
          projectId: projectID,
        })
      ).data;
      console.log("notif token: " + pushToken);
      return pushToken;
    } catch (error) {
      console.log("Error al obtener el token de notificaciones: " + error);
      return null;
    }
  } else {
    console.log("Debes usar un dispositivo físico para recibir notificaciones");
    return null;
  }
}

export async function sendPushNotification(
  expoPushToken: string,
  title: string,
  body: string,
  data: object = {}
) {
  try {
    const message = {
      to: expoPushToken,
      sound: "default",
      title,
      body,
      data,
    };

    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      console.error("Error al enviar la notificación:", await response.text());
    } else {
      console.log("Notificación enviada con éxito");
    }
  } catch (error) {
    console.error("Error al enviar la notificación:", error);
  }
}
