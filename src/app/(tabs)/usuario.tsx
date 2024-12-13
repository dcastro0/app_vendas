import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import { useAuth } from "@/hooks/useAuth";

const AccountScreen = () => {
  const { signOut, authData } = useAuth();

  // Função para logar o usuário
  const handleLogout = () => {
    signOut();
  };
  // Função para deletar a conta
  const handleDeleteAccount = () => {
    Alert.alert(
      "Deletar Conta",
      "Tem certeza que deseja deletar sua conta? Esta ação é irreversível.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Deletar", onPress: () => console.log("Conta deletada") }, // Substitua com sua lógica
      ],
    );
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

      {/* Informações do Usuário */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações de Conta</Text>
        <Text style={styles.infoText}>Email: {authData?.email}</Text>
      </View>

      {/* Histórico de Transações */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Histórico de Transações</Text>
        <Pressable style={styles.option}>
          <Text style={styles.optionText}>Ver Transações</Text>
        </Pressable>
      </View>

      {/* Logout e Deletar Conta */}
      <View style={styles.section}>
        <Pressable style={styles.dangerButton} onPress={handleDeleteAccount}>
          <Text style={styles.dangerButtonText}>Deletar Conta</Text>
        </Pressable>
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Sair</Text>
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
  option: {
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 16,
    color: "#007BFF",
  },
  dangerButton: {
    backgroundColor: "#FF6347",
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  dangerButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
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
