import axios from "axios";
import { SignInProp } from "@/interfaces/AuthContextData";
import { AuthData } from "@/interfaces/AuthData";

async function signIn(data: SignInProp): Promise<AuthData> {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.email || !data.password) {
        throw new Error("E-mail e senha são obrigatórios");
      }
      if (data.email === "offline@offline.com" && data.password === "offline") {
        return resolve({
          token: "offline",
          id: 0,
          name: "Offline",
          email: "offline@offline.com",
        });
      }

      const response = await axios.post(
        "https://menu.flowsay.io/sistema/applogin.php",
        {
          email: data.email,
          password: data.password,
        },
      );
      return resolve({
        token: "response.data.token",
        id: response.data.user.id,
        name: response.data.user.nome,
        email: data.email,
      });
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
