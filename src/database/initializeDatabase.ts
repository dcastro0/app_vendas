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

    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS comandas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        id_usuario INTEGER NOT NULL,
        active INTEGER DEFAULT 1,
        createdAt  TEXT NOT NULL
      );
    `);

    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS item_comanda (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        value REAL NOT NULL,
        id_comanda INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        FOREIGN KEY (id_comanda) REFERENCES comandas(id)
        );
    `);

  } catch (error) {
    console.error("Erro ao criar as tabelas", error);
    throw new Error("Erro ao criar a tabela de pagamentos ou comandas");
  }
};

export default initializeDatabase;
