import { useAuth } from "@/hooks/useAuth";
import { PaymentFormData } from "@/schema/schema";
import { useSQLiteContext } from "expo-sqlite";

export function usePaymentDb() {
  const database = useSQLiteContext();
  const { authData } = useAuth();
  async function insertPayment(data: PaymentFormData) {
    const statament = await database.prepareAsync(
      "INSERT INTO payments (value, payMethod, createdAt, id_usuario, troco, total_pago) VALUES (?, ?, ?, ?, ?, ?)",
    );
    const { value, payMethod } = data;
    try {
      if (!authData?.id) {
        console.log("Usuário não autenticado");
        throw new Error("Usuário não autenticado");
      }
      const response = await statament.executeAsync([
        parseFloat(value.replace("R$", "").replace(",", ".").trim()),
        payMethod,
        new Date().toLocaleString(),
        authData.id,
        payMethod === "dinheiro" ? data.troco ?? 0 : 0,
        payMethod === "dinheiro" ? data.total_pago ?? data.value : data.value
      ]);
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
  async function getPaymentsNoSync() {
    try {
      const query = "SELECT * FROM payments WHERE sync = 0";
      const response = await database.getAllAsync(query);
      return response;
    } catch (error) {
      throw error;
    }
  }
  const updateSync = async (id: number) => {
    const statament = await database.prepareAsync(`UPDATE payments SET sync = 1 WHERE id = ?`);
    try {
      if (!id) {
        throw new Error("ID é obrigatório");
      }
      const response = await statament.executeAsync([id]);
      return response;
    } catch (error) {
      throw error;
    }
  }
  return { insertPayment, getPayments, getPaymentsNoSync, updateSync };
}
