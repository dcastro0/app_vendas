import axios, { AxiosError } from "axios";
import { Vendas } from "@/schema/schemaVenda";

async function sync(data: Vendas[]): Promise<any> {

  if (data.length === 0) {
    throw new Error("Não há dados para sincronizar.");
  }
  try {
    const response = await axios.post(
      "https://menu.flowsay.io/sistema/appsync.php",
      data,
      { timeout: 5000 }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const errorMessage = (axiosError.response?.data as { error?: string })?.error || "Erro de autenticação";
      throw new Error(errorMessage);
    } else {
      throw new Error("Erro desconhecido");
    }
  }
}

export default sync;
