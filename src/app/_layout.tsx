import { AuthProvider } from "@/contexts/Auth";
import initializeDatabase from "@/database/initializeDatabase"
import { Slot } from "expo-router"
import { SQLiteProvider } from "expo-sqlite"

const Layout = () => {
  return (

    <SQLiteProvider databaseName="sqlite.db" onInit={initializeDatabase}>
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </SQLiteProvider>

  );
}

export default Layout;
