import { usePaymentDb } from "@/database/usePayamentDb";
import { PaymentFormData } from "@/schema/schema";
import { useState, useEffect } from "react";
import { RefreshControl, FlatList, View, Text } from "react-native";
import tw from "twrnc";
import Button from "@/components/Button";
import ListRow from "@/components/ListRow";

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
    <View style={tw`flex justify-center items-center p-2`}>
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={getPayments} />
        }
        data={[...show].reverse()}
        keyExtractor={(item) => item.id?.toString() ?? ""}
        renderItem={({ item }) => (
          <View style={tw`flex-row justify-between p-1 w-full border border-white  ${item!.sync === 0 ? 'bg-violet-700' : 'bg-green-500'} `} key={item.id}>
            <ListRow>{item.id}</ListRow>
            <ListRow>{formatCurrency(parseFloat(item.value))}</ListRow>
            <ListRow>{item.payMethod}</ListRow>
            <ListRow>{formatDate(item.createdAt || '')}</ListRow>
            <ListRow>{item.id_usuario}</ListRow>
          </View>
        )}
        ListEmptyComponent={renderEmptyList}
      />
    </View>
  );
};

export default Lista;
