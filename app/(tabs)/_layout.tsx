import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import Header from "@/components/Header";

export default function HomeLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={({ navigation }) => ({
        header: ({ navigation }) => (
          <Header navigation={navigation} canGoBack={false} />
        ),
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].background,
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Menu",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name={focused ? "fast-food" : "fast-food-outline"}
              color={"#3D9D3D"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="pedidos"
        options={{
          title: "Pedidos",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name={focused ? "document-text" : "document-text-outline"}
              color={"#3D9D3D"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="carrito"
        options={{
          title: "Carrito",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name={focused ? "cart" : "cart-outline"}
              color={"#3D9D3D"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name={focused ? "person" : "person-outline"}
              color={"#3D9D3D"}
            />
          ),
        }}
      />
    </Tabs>
  );
}
