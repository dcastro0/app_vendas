import initializeDatabase from "@/database/initializeDatabase"
import { Slot } from "expo-router"
import { SQLiteProvider } from "expo-sqlite"

const Layout = () => {
  return (
    <SQLiteProvider databaseName="sqlite.db" onInit={initializeDatabase}>
      <Slot />
    </SQLiteProvider>
  );
}

export default Layout;
