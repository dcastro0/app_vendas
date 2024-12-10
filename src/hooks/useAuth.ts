import { useContext } from "react";
import { AuthContext } from "@/contexts/Auth";

export const useAuth = () => {
  const { authData, loading, signIn, signOut } = useContext(AuthContext);

  return {
    authData,
    loading,
    signIn,
    signOut,
  };
};
