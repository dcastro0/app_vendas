import React, { useState } from "react";
import { View, Text, Pressable, Alert, ScrollView } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import tw from "twrnc";
import sync from "@/services/sync";
import { usePaymentDb } from "@/database/usePayamentDb";
import { Vendas } from "@/schema/schemaVenda";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

const AccountScreen = () => {
  const { signOut, authData } = useAuth();
  const { getPaymentsNoSync, updateSync, getOfflinePayments, updateUser } = usePaymentDb();
  const [data, setData] = useState<Vendas[]>([]);

  const handleLogout = () => {
    signOut();
  };

  async function getData() {
    const response = await getPaymentsNoSync();
    setData(response as Vendas[]);
  }

  async function getDataOff() {
    const response = await getOfflinePayments();
    setData(response as Vendas[]);
  }

  const handleSync = async () => {
    if (!authData) {
      Alert.alert("Erro", "Você precisa estar logado para sincronizar os dados.");
      return;
    }

    if (authData.id === 0) {
      Alert.alert("Erro", "Não é possível sincronizar pagamentos sem usuário autenticado.");
      return;
    }

    await getData();
    if (data.length === 0) {
      Alert.alert("Erro", "Nenhum pagamento para sincronizar.");
      return;
    }

    try {
      await sync(data);

      for (let item of data) {
        try {
          await updateSync(item.id);
        } catch (error) {
          if (error instanceof Error) {
            Alert.alert("Erro", error.message);
          } else {
            Alert.alert("Erro", "Não foi possível sincronizar os dados.");
          }
        }
      }
      Alert.alert("Sucesso", "Dados sincronizados com sucesso.");
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Erro", error.message);
      } else {
        Alert.alert("Erro", "Falha ao sincronizar os dados.");
      }
    } finally {
      setData([]);
    }
  };

  const syncOffline = async () => {
    if (!authData) {
      Alert.alert("Erro", "Você precisa estar logado para sincronizar os dados.");
      return;
    }

    if (authData.id === 0) {
      Alert.alert("Erro", "Não é possível sincronizar pagamentos sem usuário autenticado.");
      return;
    }

    await getDataOff();
    if (data.length === 0) {
      Alert.alert("Erro", "Nenhum pagamento para sincronizar.");
      return;
    }

    try {
      for (let item of data) {
        try {
          await updateUser(item.id);
        } catch (error) {
          if (error instanceof Error) {
            Alert.alert("Erro", error.message);
          } else {
            Alert.alert("Erro", "Não foi possível sincronizar os dados.");
          }
        }
      }
      Alert.alert("Sucesso", "Dados sincronizados com sucesso.");
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Erro", error.message);
      } else {
        Alert.alert("Erro", "Falha ao sincronizar os dados.");
      }
    } finally {
      setData([]);
    }
  }

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

      <View style={tw`gap-2`}>
        {authData?.id === 0 ? (
          <Text style={tw`text-center text-red-400 font-bold text-xl mb-2`}>Faça login para sincronizar dados.</Text>
        ) : (
          <View style={tw`pt-8 gap-2`}>
            <Pressable style={tw`bg-blue-600 p-4 rounded-md`} onPress={syncOffline}>
              <Text style={tw`text-white font-bold text-center text-xl`}>Sincronizado dados Offline</Text>
            </Pressable>
            <Pressable style={tw`bg-green-500 p-4 rounded-md`} onPress={handleSync}>
              <Text style={tw`text-white text-center font-bold text-xl`}>Sincronizar</Text>
            </Pressable>
          </View>
        )}
        <Pressable style={tw`bg-red-500 p-4 rounded-md`} onPress={handleLogout}>
          <Text style={tw`text-white font-bold text-center text-xl`}>Sair</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default AccountScreen;
