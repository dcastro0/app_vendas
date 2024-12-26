import React from "react";
import { AuthProvider } from "@/contexts/Auth";
import initializeDatabase from "@/database/initializeDatabase";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import tw from "twrnc";
import { StatusBar } from "react-native";

const Layout = () => {
  return (
    <SQLiteProvider databaseName="sqlite.db" onInit={initializeDatabase}>
      <AuthProvider>
        <StatusBar barStyle="dark-content" />
        <Stack
          initialRouteName="root"
          screenOptions={{
            headerShown: false,



            headerStyle: { backgroundColor: tw.color("slate-300") },
            headerTitleStyle: { color: tw.color("blue-700"), fontSize: 24, fontWeight: "bold" },

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
              title: "Fechar Comanda",
            }}
          />
          <Stack.Screen
            name="comanda/twoMetodoPag/[id]"
            options={{
              headerShown: true,
              headerTitleAlign: "center",
              title: "Metodo de Pagamento",
            }}
          />
        </Stack>
      </AuthProvider>
    </SQLiteProvider>
  );
};

export default Layout;
