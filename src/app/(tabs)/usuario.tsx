import React, { useState } from "react";
import { View, Text, Image, StyleSheet, Pressable, Alert, ScrollView } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import tw from "twrnc";
import sync from "@/services/sync";
import { usePaymentDb } from "@/database/usePayamentDb";
import { Vendas } from "@/schema/schemaVenda";

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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: "https://www.example.com/profile-picture.jpg" }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{authData?.name}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações de Conta</Text>
        <Text style={styles.infoText}>Email: {authData?.email}</Text>
      </View>

      <View style={styles.section}>
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Sair</Text>
        </Pressable>
        <Pressable
          style={tw`bg-green-500 p-4 rounded-md`}
          onPress={handleSync}
        >
          <Text style={tw`text-white text-center`}>Sincronizar</Text>
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
