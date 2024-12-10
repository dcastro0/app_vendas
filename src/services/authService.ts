import axios from "axios";
import { SignInProp } from "@/interfaces/AuthContextData";
import { AuthData } from "@/interfaces/AuthData";

async function signIn(data: SignInProp): Promise<AuthData> {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.email || !data.password) {
        throw new Error("E-mail e senha são obrigatórios");
      }
      if (data.email === "caio@email.com" && data.password === "123456") {
        resolve({
          token: "token",
          email: data.email,
          name: "Caio",
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        reject(
          new Error(error.response.data.message || "Erro de autenticação"),
        );
      } else {
        reject(new Error("Erro desconhecido"));
      }
    }
  });
}

export const authService = { signIn };
