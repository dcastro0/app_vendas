import { usePaymentDb } from "@/database/usePayamentDb";
import { PaymentFormData } from "@/schema/schema";
import { useState, useEffect } from "react";
import { RefreshControl, FlatList, View, Text } from "react-native";
import tw from "twrnc";
import Button from "@/components/Button";
import ListRow from "@/components/ListRow";
import { Feather, FontAwesome } from "@expo/vector-icons";

const Lista = () => {
  const [show, setShow] = useState<PaymentFormData[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const paymentDb = usePaymentDb();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  };

  async function getPayments() {
    setRefreshing(true);
    const response = await paymentDb.getPayments() as PaymentFormData[];
    setShow(response as PaymentFormData[]);
    setRefreshing(false);
  }
  useEffect(() => {
    getPayments();
  }, []);

  const renderEmptyList = () => (
    <View style={tw`flex justify-center items-center p-4`}>
      <Text style={tw`text-2xl`}>Nenhum item ainda!</Text>
      <Button onPress={getPayments}>Refresh</Button>
    </View>
  );

  return (
    <View style={tw`flex-1 justify-center items-center p-2`}>
      <View style={tw`flex-row justify-between p-1 w-full bg-slate-950 border border-white rounded-t-md`}>
        <ListRow>Id</ListRow>
        <ListRow> - </ListRow>
        <ListRow>Valor</ListRow>
        <ListRow> - </ListRow>
        <ListRow>Metódo de Pagamento</ListRow>
        <ListRow> - </ListRow>
        <ListRow>Data</ListRow>
        <ListRow> - </ListRow>
        <ListRow>Id Usuário</ListRow>
      </View>

      <FlatList
        style={tw`flex-1`} // Isso vai fazer a lista ocupar o espaço restante
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={getPayments} />
        }
        data={[...show].reverse()}
        keyExtractor={(item) => item.id?.toString() ?? ""}
        renderItem={({ item }) => (
          <View
            style={tw`flex-row justify-between p-1 w-full border border-white ${item!.sync === 0
              ? item!.id_usuario === 0
                ? 'bg-red-600'
                : 'bg-violet-700'
              : 'bg-green-500'
              } `}
            key={item.id}
          >
            <ListRow>{item.id}</ListRow>
            <ListRow>{formatCurrency(parseFloat(item.value))}</ListRow>
            <ListRow>{item.payMethod}</ListRow>
            <ListRow>{formatDate(item.createdAt || '')}</ListRow>
            <ListRow>{item.id_usuario}</ListRow>
          </View>
        )}
        ListEmptyComponent={renderEmptyList}
      />

      {/* Legenda */}
      <View style={tw`flex-col justify-end items-start p-2 w-full border-white rounded-b-md bg-gray-100 gap-1`}>
        <Text style={tw`font-semibold text-lg`}>Legenda:</Text>
        <View style={tw`flex-row items-center gap-1`}>
          <FontAwesome name="square" size={12} color={tw.color('red-600')} />
          <Text style={tw`text-sm text-gray-800`}>Offline</Text>
        </View>
        <View style={tw`flex-row items-center gap-1`}>
          <FontAwesome name="square" size={12} color={tw.color('violet-700')} />
          <Text style={tw`text-sm text-gray-800`}>Não Sincronizado</Text>
        </View>
        <View style={tw`flex-row items-center gap-1`}>
          <FontAwesome name="square" size={12} color={tw.color('green-500')} />
          <Text style={tw`text-sm text-gray-800`}>Sincronizado</Text>
        </View>
      </View>
    </View>
  );

};

export default Lista;
