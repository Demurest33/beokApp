import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import Header from "@/components/Header";
import SplashScreenComponent from "@/components/SplashScreen";
import { NotificationProvider } from "@/context/NotificationContext";
import * as Notifications from "expo-notifications";
import { useColorScheme } from "@/hooks/useColorScheme";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isAppReady, setIsAppReady] = useState(false);
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded || !isAppReady) {
    return (
      <SplashScreenComponent
        onFinish={() => {
          setIsAppReady(true);
          SplashScreen.hideAsync();
        }}
      />
    );
  }

  return (
    <NotificationProvider>
      {/* value={colorScheme === "dark" ? DarkTheme : DefaultTheme} */}
      <ThemeProvider value={DefaultTheme}>
        <Stack
          screenOptions={({ navigation }) => ({
            header: ({ navigation }) => (
              <Header
                navigation={navigation}
                canGoBack={navigation.canGoBack()}
              />
            ),
          })}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="admin" options={{ headerShown: false }} />
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen
            name="products/[id]"
            //Nombre del producto como titulo de la pantalla
            options={({ route }) => ({
              headerTitle: (route.params as { name: string })?.name,
            })}
          />
          <Stack.Screen
            name="myOrders/[id]"
            //ID del pedido como titulo de la pantalla
            options={({ route }) => ({
              headerTitle:
                "Numero de pedido: " + (route.params as { id: string })?.id,
            })}
          />

          <Stack.Screen name="PedidoExitoso" />
        </Stack>
      </ThemeProvider>
    </NotificationProvider>
  );
}
