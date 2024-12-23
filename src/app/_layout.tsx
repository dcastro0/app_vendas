import React, { useEffect } from "react";
import { AuthProvider } from "@/contexts/Auth";
import initializeDatabase from "@/database/initializeDatabase";
import { router, SplashScreen, Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { Pressable, Text } from "react-native";

const Layout = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, [2000]);
  return (
    <SQLiteProvider databaseName="sqlite.db" onInit={initializeDatabase}>
      <AuthProvider>
        <Stack initialRouteName="root" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="root" />
          <Stack.Screen name="troco/[valor]" options={{
            headerShown: true, headerTitleAlign: 'center', title: "Troco", headerLeft: () => {
              return (
                <Pressable onPress={() => router.back()}><Text>Voltar</Text></Pressable>
              );
            }
          }} />
          <Stack.Screen name="login_sync" />
        </Stack>
      </AuthProvider>
    </SQLiteProvider>
  );
};

export default Layout;
