import { useAuth } from "@/hooks/useAuth";
import { ItemComandaType } from "@/schema/schemaComanda";
import { useSQLiteContext } from "expo-sqlite";
import { usePaymentDb } from "./usePayamentDb";
import { PayMethodType } from "@/schema/schema";

export function useComandaDb() {
  const database = useSQLiteContext();
  const { authData } = useAuth();
  const { insertPayment } = usePaymentDb();


  async function getAllComandas() {
    try {
      if (!authData) {
        throw new Error("Usuário não autenticado");
      }

      const query = `SELECT * FROM comandas WHERE (id_usuario = ? OR id_usuario = 0) AND active = 1`;
      const params = [authData.id];
      const comandas = await database.getAllAsync(query, params);

      const comandasComTotal = await Promise.all(comandas.map(async (comanda: any) => {
        const itemsQuery = `SELECT value, quantity FROM item_comanda WHERE id_comanda = ?`;
        const itemsParams = [comanda.id];
        const items = await database.getAllAsync(itemsQuery, itemsParams);

        const totalValue = items.reduce((acc: number, item: any) => acc + (item.value * item.quantity), 0);

        return { ...comanda, value: totalValue, items_comanda: items };
      }));

      return comandasComTotal;
    } catch (error) {
      console.error("Erro ao buscar comandas:", error);
      throw error;
    }
  }

  async function createComanda(name: string) {
    try {
      if (!authData) {
        throw new Error("Usuário não autenticado");
      }

      const statament = await database.prepareAsync("INSERT INTO comandas (id_usuario, name, createdAt) VALUES (?, ?, ?)");
      const response = await statament.executeAsync([authData.id, name, new Date().toISOString()]);
      return response;
    } catch (error) {
      console.error("Erro ao criar comanda:", error);
      throw error;
    }
  }

  async function addItemComanda(data: ItemComandaType) {
    if (!authData) {
      throw new Error("Usuário não autenticado");
    }

    try {
      const statement = await database.prepareAsync("INSERT INTO item_comanda (id_comanda, value, quantity) VALUES (?, ?, ?)");
      const parsedValue = parseFloat(data.value.replace("R$", "").replace(".", "").replace(",", ".").trim());

      if (isNaN(parsedValue)) {
        throw new Error("Valor inválido.");
      }

      const response = await statement.executeAsync([data.id_comanda, parsedValue, parseInt(data.quantity)]);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async function getComandaById(id: number) {
    if (!authData) {
      throw new Error("Usuário não autenticado");
    }
    try {
      const query = "SELECT * FROM comandas WHERE id = ?";
      const params = [id];
      const comanda = await database.getAllAsync(query, params);
      if (comanda.length === 0) {
        throw new Error("Comanda não encontrada");
      }

      const itemsQuery = "SELECT id, value, quantity FROM item_comanda WHERE id_comanda = ?";
      const itemsParams = [id];
      const items = await database.getAllAsync(itemsQuery, itemsParams);

      const totalValue = items.reduce((acc: number, item: any) => acc + (item.value * item.quantity), 0);

      const comandaObj = comanda[0] || {};
      return { ...comandaObj, value: totalValue, items_comanda: items };
    } catch (error) {
      console.error("Erro ao buscar comanda:", error);
      throw error;
    }
  }

  async function closeComanda(id: number, paymentMethod: PayMethodType, troco: number) {
    if (!authData) {
      throw new Error("Usuário não autenticado");
    }

    try {
      const comanda = await getComandaById(id);
      const totalValue = comanda.value;

      const data = {
        value: totalValue.toString(),
        payMethod: paymentMethod,
        troco: troco,
      };

      await insertPayment(data);

      const statement = await database.prepareAsync("UPDATE comandas SET active = 0 WHERE id = ?");
      const updateResponse = await statement.executeAsync([id]);

      if (updateResponse.changes === 0) {
        throw new Error("Erro ao desativar a comanda");
      }

      return updateResponse;
    } catch (error) {
      console.error("Erro ao fechar comanda:", error);
      throw error;
    }
  }

  async function closeComandaTwoMethods(id: number, payMethod: PayMethodType, payMethod2: PayMethodType, value: string, value2: string) {
    if (!authData) {
      throw new Error("Usuário não autenticado");
    }
    const parsedValue = parseFloat(value.replace("R$", "").replace(".", "").replace(",", ".").trim());
    const parsedValue2 = parseFloat(value2.replace("R$", "").replace(".", "").replace(",", ".").trim());
    if (parsedValue === 0 || parsedValue2 === 0) {
      throw new Error("Valor não informado");
    }

    try {
      const comanda = await getComandaById(id);
      const totalValue = comanda.value;
      if (parsedValue + parsedValue2 !== totalValue) {
        throw new Error("Valores invalidos");
      }

      const data = {
        value: totalValue.toString(),
        payMethod: payMethod,
        payMethod2: payMethod2,
      };

      await insertPayment(data);

      const statement = await database.prepareAsync("UPDATE comandas SET active = 0 WHERE id = ?");
      const updateResponse = await statement.executeAsync([id]);

      if (updateResponse.changes === 0) {
        throw new Error("Erro ao desativar a comanda");
      }

      return updateResponse;
    } catch (error) {
      console.error("Erro ao fechar comanda:", error);
      throw error;
    }
  }

  return { getAllComandas, createComanda, addItemComanda, getComandaById, closeComanda, closeComandaTwoMethods };
}
