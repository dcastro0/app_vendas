import React from "react";
import { useAuth } from "@/hooks/useAuth";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Redirect, Tabs } from "expo-router";
import { Text, View } from "react-native";

export default function TabLayout() {
  const { authData, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Carregando aplicativo...</Text>
      </View>
    );
  }
  if (!authData) {
    return <Redirect href="/login" />;
  }
  return (
    <Tabs
      screenOptions={{ tabBarActiveTintColor: "blue" }}
      initialRouteName="(venda)/index"
    >
      <Tabs.Screen
        name="(venda)/index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="lista"
        options={{
          title: "Lista",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="list" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="usuario"
        options={{
          title: "Usuário",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="user" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
