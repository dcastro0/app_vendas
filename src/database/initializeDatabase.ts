import { type SQLiteDatabase } from "expo-sqlite";

const initializeDatabase = async (database: SQLiteDatabase) => {
  try {
    await database.execAsync(`
      DROP TABLE IF EXISTS payments;
      CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        value TEXT NOT NULL,
        payMethod TEXT NOT NULL,
        createdAt DATETIME NOT NULL,
        sincronized BOOLEAN NOT NULL DEFAULT 0
      );
      

    `);
    console.log("Tabela 'payments' criada ou já existe.");
  } catch (error) {
    console.error("Erro ao criar tabela 'payments':", error);
  }
}

export default initializeDatabase;
