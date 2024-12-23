import { type SQLiteDatabase } from "expo-sqlite";

const initializeDatabase = async (database: SQLiteDatabase) => {
  try {
    await database.execAsync(`
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
  } catch (error) {
    throw new Error("Erro ao criar a tabela de pagamentos");
  }
};

export default initializeDatabase;
