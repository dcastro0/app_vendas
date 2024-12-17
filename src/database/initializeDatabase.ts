import { type SQLiteDatabase } from "expo-sqlite";

const initializeDatabase = async (database: SQLiteDatabase) => {
  try {
    await database.execAsync(`
      DROP TABLE IF EXISTS payments;
      CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        value REAL NOT NULL,
        payMethod TEXT NOT NULL,
        createdAt DATETIME NOT NULL,
        sync INTEGER DEFAULT 0,  
        id_usuario INTEGER NOT NULL, 
        total_pago REAL NOT NULL,
        troco REAL NOT NULL
      );
    `);
    console.log("Tabela 'payments' criada ou já existe.");
  } catch (error) {
    console.error("Erro ao criar tabela 'payments':", error);
  }
};

export default initializeDatabase;
