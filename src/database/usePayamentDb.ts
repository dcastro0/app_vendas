import { useAuth } from "@/hooks/useAuth";
import { PaymentFormData } from "@/schema/schema";
import { useSQLiteContext } from "expo-sqlite";

export function usePaymentDb() {
  const database = useSQLiteContext();
  const { authData } = useAuth();
  async function insertPayment(data: PaymentFormData) {
    const statament = await database.prepareAsync(
      "INSERT INTO payments (value, payMethod, createdAt, id_usuario) VALUES ($value, $payMethod, $created_at, $id_usuario)",
    );
    try {
      if (!authData?.id) {
        console.log("Usuário não autenticado");
        throw new Error("Usuário não autenticado");
      }
      const response = await statament.executeAsync({
        $value: data.value,
        $payMethod: data.payMethod,
        $created_at: new Date().toLocaleString(),
        $id_usuario: authData.id,
      });
      console.log(response);

      const insertRowId = response.lastInsertRowId.toLocaleString();
      return { insertRowId };
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      await statament.finalizeAsync();
    }
  }
  async function getPayments() {
    try {
      const query = "SELECT * FROM payments";
      const response = await database.getAllAsync(query);
      return response;
    } catch (error) {
      throw error;
    }
  }
  return { insertPayment, getPayments };
}
