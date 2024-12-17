import { usePaymentDb } from "@/database/usePayamentDb";
import { PaymentFormData } from "@/schema/schema";
import { styles } from "@/styles/styles";
import { useState, useEffect } from "react";
import { RefreshControl, FlatList, View, Text } from "react-native";
import tw from "twrnc";
import Button from "@/components/Button";
import ListRow from "@/components/ListRow";

const Lista = () => {
  const [show, setShow] = useState<PaymentFormData[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const paymentDb = usePaymentDb();
  async function getPayments() {
    setRefreshing(true);
    const response = await paymentDb.getPayments();
    setShow(response as PaymentFormData[]);
    setRefreshing(false);
  }
  useEffect(() => {
    getPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderEmptyList = () => (
    <View style={styles.container}>
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
            <ListRow>{item.value}</ListRow>
            <ListRow>{item.payMethod}</ListRow>
            <ListRow>{item.createdAt}</ListRow>
            <ListRow>{item.id_usuario}</ListRow>
          </View>
        )}
        ListEmptyComponent={renderEmptyList}
      />
    </View>
  );
};

export default Lista;
