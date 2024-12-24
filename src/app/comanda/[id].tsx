import { useComandaDb } from '@/database/useComandaDb';
import { ComandaType, ItemComandaType } from '@/schema/schemaComanda';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import tw from 'twrnc';

const Comanda = () => {
  const comandaDb = useComandaDb();
  const { getComandaById } = comandaDb;
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [comanda, setComanda] = useState<ComandaType>();

  const comandaId = parseInt(id as string);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getComanda = async () => {
    const response = await getComandaById(Number(id)) as unknown as ComandaType;
    setComanda(response);
  };

  useEffect(() => {
    getComanda();
  }, []);

  const navigateToItem = () => {
    router.push({ pathname: '/comanda/item/[id]', params: { id: comandaId } });
  };

  const renderItem = ({ item }: { item: ItemComandaType }) => (
    <View style={tw`bg-blue-500 p-4 rounded-md mt-2`} key={item.id}>
      <Text style={tw`text-white text-lg`}>Item: {item.id}</Text>
      <Text style={tw`text-white text-sm`}>Quantidade: {item.quantity}</Text>
      <Text style={tw`text-white text-sm`}>Valor: {formatCurrency(parseFloat(item.value))}</Text>
    </View>
  );

  if (!comanda) return <Text>Loading...</Text>;

  if (comanda.items_comanda?.length === 0 || !comanda.items_comanda) {
    return (
      <View style={tw`flex-1 p-4`}>
        <Text style={tw`text-2xl font-bold`}>{comanda.name}</Text>
        <Text style={tw`text-lg font-medium`}>Valor total: R$ {comanda.value?.toFixed(2) ?? '0.00'}</Text>
        <Text style={tw`text-lg font-medium`}>Data de Criação: {new Date(comanda.createdAt).toLocaleDateString()}</Text>

        <Text style={tw`mt-6 text-lg font-medium`}>Itens da Comanda:</Text>


        <Text style={tw`text-lg text-gray-500 mt-2`}>Nenhum item na comanda.</Text>

        <Pressable style={tw`bg-green-500 p-3 rounded-md mt-4`} onPress={() => navigateToItem()}>
          <Text style={tw`text-white font-bold text-xl`}>Adicionar mais itens</Text>
        </Pressable>

        <Pressable style={tw`bg-red-500 p-3 rounded-md mt-4`}>
          <Text style={tw`text-white font-bold text-xl`}>Fechar Comanda</Text>
        </Pressable>
      </View>
    );

  }

  return (
    <View style={tw`flex-1 p-4`}>

      <Text style={tw`text-2xl font-bold`}>{comanda.name}</Text>
      <Text style={tw`text-lg font-medium`}>Valor total: R$ {comanda.value?.toFixed(2) ?? '0.00'}</Text>
      <Text style={tw`text-lg font-medium`}>Data de Criação: {new Date(comanda.createdAt).toLocaleDateString()}</Text>
      <Text style={tw`mt-6 text-lg font-medium`}>Itens da Comanda:</Text>
      <FlatList
        data={comanda.items_comanda}
        keyExtractor={(item) => item.id?.toString() ?? "0"}
        renderItem={renderItem}
        style={tw`mt-2`}
      />
      <Pressable style={tw`bg-green-500 p-3 rounded-md mt-4`} onPress={() => navigateToItem()}>
        <Text style={tw`text-white font-bold text-xl`}>Adicionar mais itens</Text>
      </Pressable>

      <Pressable style={tw`bg-red-500 p-3 rounded-md mt-4`}>
        <Text style={tw`text-white font-bold text-xl`}>Fechar Comanda</Text>
      </Pressable>
    </View>
  );
};

export default Comanda;
