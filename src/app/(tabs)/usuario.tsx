import React, { useState } from "react";
import { View, Text, Image, StyleSheet, Pressable, Alert, ScrollView } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import tw from "twrnc";
import sync from "@/services/sync";
import { usePaymentDb } from "@/database/usePayamentDb";
import { Vendas } from "@/schema/schemaVenda";
import { Feather } from "@expo/vector-icons";

const AccountScreen = () => {
  const { signOut, authData } = useAuth();
  const { getPaymentsNoSync, updateSync } = usePaymentDb();
  const [data, setData] = useState<Vendas[]>([]);

  const handleLogout = () => {
    signOut();
  };
  async function getData() {
    const response = await getPaymentsNoSync();
    setData(response as Vendas[]);
  }
  const handleSync = async () => {
    await getData();
    console.log("Data to sync:", data);
    if (data.length === 0) {
      Alert.alert("Erro", "Nenhum pagamento para sincronizar.");
      return;
    }
    try {
      await sync(data);
      data.forEach(async (item) => {
        try {
          await updateSync(item.id);
        } catch (error) {
          console.log(error);
          Alert.alert("Erro", "Falha ao atualizar o status de sincronização.");
        }
      });
      Alert.alert("Sucesso", "Dados sincronizados com sucesso.");
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Falha ao sincronizar os dados.");
    }
  };



  return (
    <ScrollView contentContainerStyle={tw`flex-grow p-4`}>
      <View style={tw`items-center`}>
        <Feather name="user" size={100} color="black" style={tw`p-2 bg-white rounded-full`} />
        <Text style={tw`font-bold text-3xl`}>{authData?.name}</Text>
      </View>

      <View style={tw`py-8 gap-2`}>
        <Text style={tw`font-bold text-2xl`}>Informações de Conta</Text>
        <Text style={tw`text-lg text-gray-600`}>Email: {authData?.email}</Text>
      </View>

      <View style={tw`py-8 gap-2`}>

        <Pressable
          style={tw`bg-green-500 p-4 rounded-md`}
          onPress={handleSync}
        >
          <Text style={tw`text-white text-center font-bold text-xl`}>Sincronizar</Text>
        </Pressable>
        <Pressable style={tw`bg-red-500 p-4 rounded-md`} onPress={handleLogout}>
          <Text style={tw`text-white font-bold text-center text-xl`}>Sair</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: "#555",
  },
  logoutButton: {
    backgroundColor: "#28A745",
    paddingVertical: 15,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
  },
});

export default AccountScreen;
