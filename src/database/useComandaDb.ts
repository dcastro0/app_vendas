import { useAuth } from "@/hooks/useAuth";
import { useSQLiteContext } from "expo-sqlite";

export function useComandaDb() {
  const database = useSQLiteContext();
  const { authData } = useAuth();

  async function getComandas() {
    try {
      if (!authData) {
        throw new Error("Usuário não autenticado");
      }

      const query = `SELECT * FROM comandas WHERE id_usuario = ? OR id_usuario = 0`;
      const params = [authData.id];
      const comandas = await database.getAllAsync(query, params);

      const comandasComTotal = await Promise.all(comandas.map(async (comanda: any) => {
        const itemsQuery = `SELECT value, quantity FROM item_comanda WHERE id_comanda = ?`;
        const itemsParams = [comanda.id];
        const items = await database.getAllAsync(itemsQuery, itemsParams);

        const totalValue = items.reduce((acc: number, item: any) => acc + (item.value * item.quantity), 0);

        return { ...comanda, value: totalValue };
      }));

      return comandasComTotal;
    } catch (error) {
      console.error("Erro ao buscar comandas:", error);
      throw error;
    }
  }

  return { getComandas };
}
