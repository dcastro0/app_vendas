import { PaymentFormData } from "@/schema/schema";
import { useSQLiteContext } from "expo-sqlite";

export function usePaymentDb() {
  const database = useSQLiteContext();
  async function insertPayment(data: PaymentFormData) {
    const statament = await database.prepareAsync(
      "INSERT INTO payments (value, payMethod, createdAt) VALUES ($value, $payMethod, $created_at)",
    );
    try {
      const response = await statament.executeAsync({
        $value: data.value,
        $payMethod: data.payMethod,
        $created_at: new Date().toLocaleString(),
      });

      const insertRowId = response.lastInsertRowId.toLocaleString();
      return { insertRowId };
    } catch (error) {
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
