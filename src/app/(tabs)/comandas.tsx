import { useComandaDb } from "@/database/useComandaDb";
import { useState, useEffect } from "react";
import { RefreshControl, FlatList, View, Text } from "react-native";
import tw from "twrnc";
import Button from "@/components/Button";
import ListRow from "@/components/ListRow";
import { ComandaType } from "@/schema/schemaComanda";

const Comanda = () => {
  const [show, setShow] = useState<ComandaType[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const comandaDb = useComandaDb();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  async function getComandas() {
    setRefreshing(true);
    setError(null);
    try {
      const response = await comandaDb.getComandas();
      setShow(response);
    } catch (err) {
      setError("Erro ao carregar as comandas. Tente novamente.");
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    getComandas();
  }, []);

  const renderEmptyList = () => (
    <View style={tw`flex justify-center items-center p-4`}>
      <Text style={tw`text-2xl`}>Nenhum item ainda!</Text>
      <Button onPress={getComandas}>Refresh</Button>
    </View>
  );

  const renderError = () => (
    <View style={tw`flex justify-center items-center p-4`}>
      <Text style={tw`text-2xl text-red-500`}>{error}</Text>
      <Button onPress={getComandas}>Tentar novamente</Button>
    </View>
  );

  return (
    <View style={tw`flex-1 justify-center items-center p-2`}>
      <View style={tw`flex-row justify-around p-1 w-full bg-slate-950 border border-white rounded-t-md`}>
        <Text style={tw`text-white`}>Id</Text>
        <Text style={tw`text-white`}>-</Text>
        <Text style={tw`text-white`}>Nome</Text>
        <Text style={tw`text-white`}>-</Text>
        <Text style={tw`text-white`}>Valor</Text>
      </View>

      {error ? (
        renderError()
      ) : (
        <FlatList
          style={tw`flex-1`}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={getComandas} />
          }
          data={show.reverse()}
          keyExtractor={(item) => item.id?.toString() ?? "0"}
          renderItem={({ item }) => (
            <View style={tw`flex-row justify-between p-1 w-full border border-white bg-sky-600`} key={item.id}>
              <ListRow>{item.id}</ListRow>
              <ListRow>{item.name}</ListRow>
              <ListRow>{formatCurrency(Number(item.value))}</ListRow>
            </View>
          )}
          ListEmptyComponent={renderEmptyList}
        />
      )}
    </View>
  );
};

export default Comanda;
