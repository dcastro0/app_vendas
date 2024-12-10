import React, { createContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { AuthContextData, SignInProp } from "@/interfaces/AuthContextData";
import { AuthData } from "@/interfaces/AuthData";
import { AuthProviderProps } from "@/interfaces/AuthProviderProps";
import { authService } from "@/services/authService";
import { Storage } from "expo-sqlite/kv-store";

const AuthContext = createContext<AuthContextData>({} as AuthContextData);
const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authData, setAuthData] = useState<AuthData | undefined>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadAuthDataFromStorage();
  }, []);

  async function loadAuthDataFromStorage() {
    try {
      const auth = await Storage.getItem("@AuthData");
      if (auth) {
        setAuthData(JSON.parse(auth));
      }
    } catch (error) {
      console.error(
        "Erro ao carregar dados de autenticação do armazenamento:",
        error,
      );
    } finally {
      setLoading(false);
    }
  }

  async function signIn(data: SignInProp): Promise<void> {
    try {
      const auth = await authService.signIn(data);
      setAuthData(auth);
      /* AsyncStorage.setItem("@AuthData", JSON.stringify(auth)); */
      await Storage.setItem("authData", JSON.stringify(auth));
    } catch (error: any) {
      Alert.alert("Erro ao efetuar login", error.message);
    }
  }

  async function signOut(): Promise<void> {
    setAuthData(undefined);
    Storage.removeItem("@AuthData");
  }

  return (
    <AuthContext.Provider value={{ authData, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
