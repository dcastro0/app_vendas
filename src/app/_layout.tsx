import React from "react";
import { AuthProvider } from "@/contexts/Auth";
import initializeDatabase from "@/database/initializeDatabase";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";


const Layout = () => {
  return (
    <SQLiteProvider databaseName="sqlite.db" onInit={initializeDatabase}>
      <AuthProvider>
        <Stack
          initialRouteName="root"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="root" />
          <Stack.Screen
            name="troco/[valor]"
            options={{
              headerShown: true,
              headerTitleAlign: "center",
              title: "Troco",
            }}
          />
          <Stack.Screen
            name="comanda/nome/[valor]"
            options={{
              headerShown: true,
              headerTitleAlign: "center",
              title: "Comanda",
            }}
          />
          <Stack.Screen
            name="comanda/item/[id]"
            options={{
              headerShown: true,
              headerTitleAlign: "center",
              title: "Adicionar Item",
            }}
          />
          <Stack.Screen
            name="comanda/[id]"
            options={{
              headerShown: true,
              headerTitleAlign: "center",
              title: "Dados Comanda",
            }}
          />
          <Stack.Screen
            name="comanda/metodoPag/[id]"
            options={{
              headerShown: true,
              headerTitleAlign: "center",
              title: "Dados Comanda",
            }}
          />
        </Stack>
      </AuthProvider>
    </SQLiteProvider>
  );
};

export default Layout;
